import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import { UserDto } from "../dtos/User.js";

export const register = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        });

        await user.save();
        return next(CreateSuccess(200, "User Registered Successfully!"));
    } catch (error) {
        return next(CreateError(500, "Something went wrong!"));
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(CreateError(404, "User not found!"));
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return next(CreateError(400, "Password is incorrect!"));
        }

        const userDto = new UserDto(user);
        req.session.userId = userDto.id;
        req.session.roles = userDto.roles;

        return next(CreateSuccess(200, "User Logged in Successfully!", userDto));
    } catch (error) {
        return next(CreateError(500, "Something went wrong!"));
    }
}

export const logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(CreateError(500, "Error logging out"));
        }
        res.clearCookie('connect.sid');
        return next(CreateSuccess(200, "Logged out successfully"))
    });
};

export const status = async (req, res, next) => {
    if (req.session && req.session.userId) {
        const user = await User.findOne({ _id: req.session.userId });
        if (user) {
            return next(CreateSuccess(200, "User is logged in", new UserDto(user)));
        }
    }

    return next(CreateSuccess(200, "User is not logged in", null));
}
