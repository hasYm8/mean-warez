import mongoose from "mongoose";

export const Roles = Object.freeze({
    USER: 'USER',
    UPLOADER: 'UPLOADER',
    ADMIN: 'ADMIN'
});

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        roles: {
            type: [String],
            required: true,
            enum: Roles,
            default: [Roles.USER]
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("User", UserSchema);