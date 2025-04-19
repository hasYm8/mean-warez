import User, { Roles } from "../models/User.js";
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js";
import { UserDto } from "../dtos/UserDto.js";
import mongoose from "mongoose";

export const getAll = async (req, resp, next) => {
    try {
        const users = await User.find();
        const userDtos = users.map(user => new UserDto(user));
        return next(CreateSuccess(200, "All users received", userDtos));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const getById = async (req, resp, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found!"));
        }
        return next(CreateSuccess(200, "Single user received", new UserDto(user)));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const deleteById = async (req, resp, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(CreateError(400, "Invalid userId format"));
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }

        if (user.roles.includes(Roles.ADMIN)) {
            return next(CreateError(403, "Admin users cannot be deleted"));
        }

        await User.findByIdAndDelete(req.params.id);

        return next(CreateSuccess(202, "User deleted successfully"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const update = async (req, resp, next) => {
    try {
        let updatedUser = new UserDto(req.body);

        updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            { $set: updatedUser },
            { new: true, runValidators: true }
        );

        return next(CreateSuccess(200, "Profile successfully updated"));
    } catch (error) {
        console.log(error);

        return next(CreateError(500, "Internal Server Error"));
    }
}
