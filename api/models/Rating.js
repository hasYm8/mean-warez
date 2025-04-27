import mongoose from "mongoose";

const RatingSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        torrentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        score: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Rating", RatingSchema);