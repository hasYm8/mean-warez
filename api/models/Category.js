import mongoose from "mongoose";

const CategorySchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true,
            maxlength: 20,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Category", CategorySchema);