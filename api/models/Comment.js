import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        torrentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        text: {
            type: String,
            required: true,
            maxlength: 200
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Comment", CommentSchema);