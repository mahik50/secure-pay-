import { client } from "../utility/client.js";
import jwt, {} from "jsonwebtoken";
import "dotenv/config";
export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(400).json({
                message: "unauthorised request"
            });
            return;
        }
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        if (!ACCESS_TOKEN_SECRET) {
            return res.status(500).json({
                message: "Access token secret is missing",
            });
        }
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        const userId = decodedToken.id;
        const user = await client.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            res.status(400).json({
                message: "Invalid access token"
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
//# sourceMappingURL=authMiddleware.js.map