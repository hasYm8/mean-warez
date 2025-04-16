import { CreateError } from '../utils/error.js';
import { Roles } from '../models/User.js';

export const verifyUser = (req, res, next) => {
    if (!req.session.userId) {
        return next(CreateError(401, "You are not authenticated"));
    }
    next();
}

export const verifyUploader = (req, res, next) => {
    verifyUser(req, res, () => {
        if (!req.session || !req.session.roles || !Array.isArray(req.session.roles) || (!req.session.roles.includes(Roles.UPLOADER) && !req.session.roles.includes(Roles.ADMIN))) {
            return next(CreateError(403, "Uploader access required"));
        }

        next();
    });
}

export const verifyAdmin = (req, res, next) => {
    verifyUser(req, res, () => {
        if (!req.session || !req.session.roles || !Array.isArray(req.session.roles) || !req.session.roles.includes(Roles.ADMIN)) {
            return next(CreateError(403, "Admin access required"));
        }

        next();
    });
}