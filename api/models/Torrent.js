import mongoose from "mongoose";

const TorrentSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 30
        },
        description: {
            type: String,
            required: true,
            maxlength: 300
        },
        categories: {
            type: [mongoose.Schema.Types.ObjectId]
        },
        fileName: {
            type: String,
            required: true
        },
        gridfsId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
        },
        size: {
            type: Number,
            required: true,
        },
        uploaderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        totalDownload: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Torrent", TorrentSchema);