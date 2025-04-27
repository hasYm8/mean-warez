import Torrent from "../models/Torrent.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';
import { uploader } from "../config/multer.config.js";
import multer from 'multer';
import { Readable } from 'stream';
import { bucket } from '../index.js';
import mongoose from 'mongoose';
import { TorrentDto } from "../dtos/TorrentDto.js";
import { CommentDto } from "../dtos/TorrentDto.js";

export const getAll = async (req, resp, next) => {
    try {
        const torrents = await Torrent.find();
        const torrentDtos = torrents.map(torrent => new TorrentDto(torrent));
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
        return next(CreateSuccess(200, "Single torrent received", new TorrentDto(torrent)));
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
                            categories: req.body.categories,
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

export const saveComment = async (req, res, next) => {
    try {
        const comment = new Comment({
            userId: req.body.user.id,
            torrentId: req.body.torrentId,
            text: req.body.text
        });
        const user = await User.findById(req.session.userId);

        await comment.save();
        return next(CreateSuccess(200, "Comment saved successfully"), new CommentDto(comment, user));
    } catch (error) {
        console.log(error);

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
