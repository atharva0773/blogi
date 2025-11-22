import { validateToken } from "../utils/auth.js";
import User from "../models/models-user.js";

export function checkForAuthenticationsCookie(cookieName) {
    return async (req, res, next) => {
        const token = req.cookies[cookieName];

        if (!token) {
            req.user = null;
            res.locals.user = null;
            return next();
        }

        try {
            // Token payload only contains _id
            const { _id } = validateToken(token);

            // LOAD FULL USER FROM DATABASE
            const user = await User.findById(_id);

            req.user = user;
            res.locals.user = user;

        } catch (error) {
            res.clearCookie(cookieName);
            req.user = null;
            res.locals.user = null;
        }

        next();
    };
}
