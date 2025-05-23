import Torrent from "../models/Torrent.js";
import Rating from "../models/Rating.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';
import { uploader } from "../config/multer.config.js";
import multer from 'multer';
import { Readable } from 'stream';
import { bucket } from '../index.js';
import mongoose from 'mongoose';
import { TorrentDto } from "../dtos/Torrent.js";
import { CommentDto } from "../dtos/Torrent.js";
import { CategoryDto } from "../dtos/Torrent.js";

export const getAll = async (req, resp, next) => {
    try {
        const filteredCategories = req.body && Array.isArray(req.body) ? req.body : [];
        const filteredCategoryIds = filteredCategories.map(category => category.id);

        let torrentsQuery = {};

        if (filteredCategoryIds.length > 0) {
            torrentsQuery = {
                categories: {
                    $elemMatch: {
                        $in: filteredCategoryIds
                    }
                }
            };
        }

        const torrents = await Torrent.find(torrentsQuery);

        const torrentDtos = await Promise.all(torrents.map(async (torrent) => {
            let userRateScore = null;
            const userRating = await Rating.findOne({
                torrentId: torrent._id,
                userId: req.session.userId
            });

            if (userRating) {
                userRateScore = userRating.score;
            }


            let avgRateScore = null;
            const allRatings = await Rating.find({ torrentId: torrent._id });

            if (allRatings.length > 0) {
                const totalScore = allRatings.reduce((sum, rating) => sum + rating.score, 0);
                avgRateScore = totalScore / allRatings.length;
            }

            const categoryDtos = [];
            if (torrent.categories && torrent.categories.length > 0) {
                const categoryIds = torrent.categories;
                const categories = await Category.find({ _id: { $in: categoryIds } });

                for (const category of categories) {
                    categoryDtos.push(new CategoryDto(category));
                }
            }

            return new TorrentDto(torrent, { score: userRateScore }, avgRateScore, categoryDtos);
        }));

        return next(CreateSuccess(200, "All torrents received", torrentDtos));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const getById = async (req, resp, next) => {
    try {
        const torrent = await Torrent.findById(req.params.id);
        if (!torrent) {
            return next(CreateError(404, "Torrent not found!"));
        }

        let userRateScore = null;
        const userRating = await Rating.findOne({
            torrentId: torrent._id,
            userId: req.session.userId
        });

        if (userRating) {
            userRateScore = userRating.score;
        }


        let avgRateScore = null;
        const allRatings = await Rating.find({ torrentId: torrent._id });

        if (allRatings.length > 0) {
            const totalScore = allRatings.reduce((sum, rating) => sum + rating.score, 0);
            avgRateScore = totalScore / allRatings.length;
        }

        const categoryDtos = [];
        if (torrent.categories && torrent.categories.length > 0) {
            const categoryIds = torrent.categories;
            const categories = await Category.find({ _id: { $in: categoryIds } });

            for (const category of categories) {
                categoryDtos.push(new CategoryDto(category));
            }
        }

        return next(CreateSuccess(200, "Single torrent received", new TorrentDto(torrent, { score: userRateScore }, avgRateScore, categoryDtos)));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const upload = async (req, res, next) => {
    uploader(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return next(CreateError(400, "Multer error"));
        } else if (err) {
            return next(CreateError(500, "Unknown error during upload"));
        }

        if (!req.file) {
            return next(CreateError(400, "No file uploaded"));
        }

        if (!bucket) {
            return next(CreateError(500, "File storage system is not ready."));
        }

        try {
            const readableStream = Readable.from(req.file.buffer);
            const uniqueFilename = `${Date.now()}-${req.file.originalname}`;

            const uploadStream = bucket.openUploadStream(uniqueFilename, {
                contentType: req.file.mimetype,
                metadata: { originalname: req.file.originalname }
            });

            readableStream.pipe(uploadStream)
                .on('error', () => {
                    if (!res.headersSent) {
                        return next(CreateError(500, "Failed to store file in database"));
                    }
                })
                .on('finish', async () => {
                    try {
                        const torrent = new Torrent({
                            title: req.body.title,
                            description: req.body.description,
                            categories: JSON.parse(req.body.categories).map(categoryDto => categoryDto.id),
                            fileName: uploadStream.gridFSFile.metadata.originalname,
                            gridfsId: uploadStream.id,
                            size: req.file.size,
                            uploaderId: req.session.userId
                        });
                        await torrent.save();

                        if (!res.headersSent) {
                            res.status(200).json(CreateSuccess(200, "File uploaded successfully"));
                        }
                    } catch (dbError) {
                        if (!res.headersSent) {
                            return next(CreateError(500, "File stored, but failed to save metadata"));
                        }
                    }
                });
        } catch (setupError) {
            if (!res.headersSent) {
                return next(CreateError(500, "Error processing upload before storage"));
            }
        }
    });
};

export const download = async (req, res, next) => {
    const torrentId = req.params.id;

    if (!bucket) {
        return next(CreateError(500, "File storage system is not ready"));
    }

    if (!mongoose.Types.ObjectId.isValid(torrentId)) {
        return next(CreateError(400, "Invalid file ID format"));
    }

    try {
        const torrent = await Torrent.findById(torrentId);

        if (!torrent) {
            return next(CreateError(404, "Torrent record not found"));
        }

        if (!torrent.gridfsId) {
            return next(CreateError(500, "Torrent record is incomplete (missing storage reference)"));
        }

        const gridfsId = torrent.gridfsId;
        const files = await bucket.find({ _id: gridfsId }).limit(1).toArray();

        if (!files || files.length === 0) {
            return next(CreateError(404, "File data not found in storage system"));
        }

        const file = files[0];
        const safeFileName = encodeURIComponent(torrent.fileName).replace(/['()!*]/g, (c) => '%' + c.charCodeAt(0).toString(16));

        res.set('Content-Type', file.contentType || 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`);
        res.set('Content-Length', file.length);
        const downloadStream = bucket.openDownloadStream(gridfsId);

        downloadStream.on('error', () => {
            if (!res.headersSent) {
                return next(CreateError(500, "Error streaming file from storage"));
            } else {
                res.end();
            }
        });

        res.on('finish', async () => {
            try {
                await Torrent.findByIdAndUpdate(
                    torrentId,
                    { $inc: { totalDownload: 1 } }
                );
            } catch (error) {
                console.log(error);
            }
        });

        downloadStream.pipe(res);
    } catch (error) {
        if (error.name === 'CastError') {
            return next(CreateError(400, "Invalid file ID format encountered"));
        }
        if (!res.headersSent) {
            return next(CreateError(500, "Internal Server Error during download process"));
        }
    }
};

export const deleteTorrent = async (req, resp, next) => {
    try {
        const torrent = await Torrent.findById(req.params.id);

        if (!torrent) {
            return next(CreateError(404, "Torrent not found"));
        }

        const isAdmin = req.session.roles && req.session.roles.includes('ADMIN');
        const isTorrentOwner = req.session.userId === torrent.uploaderId.toString();

        if (!isAdmin && !isTorrentOwner) {
            return next(CreateError(403, "Not authorized to delete this torrent"));
        }

        const deleteResult = await Torrent.deleteOne({ _id: req.params.id });

        if (deleteResult.deletedCount === 0) {
            return next(CreateError(404, "Torrent not found"));
        }

        await Comment.deleteMany({ torrentId: req.params.id });

        await Rating.deleteMany({ torrentId: req.params.id });

        const gridfsId = torrent.gridfsId;
        if (gridfsId && bucket) {
            try {
                await bucket.delete(new mongoose.Types.ObjectId(gridfsId));
            } catch (gridfsError) {
                console.error("Error deleting file from GridFS:", gridfsError);
            }
        }

        return next(CreateSuccess(200, "Torrent and associated data deleted successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const saveComment = async (req, res, next) => {
    try {
        const comment = new Comment({
            userId: req.body.user.id,
            torrentId: req.body.torrentId,
            text: req.body.text
        });
        const user = await User.findById(req.session.userId);

        await comment.save();
        return next(CreateSuccess(200, "Comment saved successfully", new CommentDto(comment, user)));
    } catch (error) {
        return next(CreateError(500, "Something went wrong"));
    }
}

export const getAllComments = async (req, resp, next) => {
    try {
        const comments = await Comment.find({ torrentId: req.params.id });

        const commentPromises = comments.map(async comment => {
            const user = await User.findById(comment.userId);
            return new CommentDto(comment, user);
        });
        const commentDtos = await Promise.all(commentPromises);

        return next(CreateSuccess(200, "All comments received", commentDtos));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const deleteComment = async (req, resp, next) => {
    try {
        const commentId = req.params.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(CreateError(404, "Comment not found"));
        }

        const isAdmin = req.session.roles && req.session.roles.includes('ADMIN');
        const isCommentOwner = req.session.userId === comment.userId.toString();

        if (!isAdmin && !isCommentOwner) {
            return next(CreateError(403, "Not authorized to delete this comment"));
        }

        const deleteResult = await Comment.findByIdAndDelete(commentId);

        if (deleteResult.deletedCount === 0) {
            return next(CreateError(404, "Comment not found"));
        }

        return next(CreateSuccess(200, "Comment deleted successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const rate = async (req, res, next) => {
    try {
        const filter = {
            userId: req.session.userId,
            torrentId: req.params.id
        };

        const update = {
            score: req.body.score
        };

        const options = {
            upsert: true,
            new: true
        };

        await Rating.findOneAndUpdate(filter, update, options);
        return next(CreateSuccess(200, "Torrent rated successfully"));
    } catch (error) {
        return next(CreateError(500, "Something went wrong"));
    }
}

export const deleteRate = async (req, resp, next) => {
    try {
        const filter = {
            userId: req.session.userId,
            torrentId: req.params.id
        };

        const deleteResult = await Rating.deleteOne(filter);

        if (deleteResult.deletedCount === 0) {
            return next(CreateError(404, "Rating not found"));
        }

        return next(CreateSuccess(200, "Rating deleted successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const createCategory = async (req, res, next) => {
    try {
        const category = new Category({
            userId: req.session.userId,
            name: req.body.name
        });
        await category.save();

        return next(CreateSuccess(200, "Category saved successfully", new CategoryDto(category)));
    } catch (error) {
        return next(CreateError(500, "Something went wrong"));
    }
}

export const getAllCategories = async (req, resp, next) => {
    try {
        const categories = await Category.find();
        const categoryDtos = categories.map(category => new CategoryDto(category));
        return next(CreateSuccess(200, "All categories received", categoryDtos));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const deleteCategory = async (req, resp, next) => {
    try {
        const deleteResult = await Category.deleteOne({ _id: req.params.id });

        if (deleteResult.deletedCount === 0) {
            return next(CreateError(404, "Category not found"));
        }

        return next(CreateSuccess(200, "Category deleted successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const updateCategory = async (req, resp, next) => {
    try {
        let updatedCategory = req.body;

        updatedCategory = await Category.findByIdAndUpdate(
            updatedCategory.id,
            { $set: updatedCategory },
            { new: true, runValidators: true }
        );

        return next(CreateSuccess(200, "Category successfully updated"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}
