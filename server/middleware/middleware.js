import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication Error, Login Again" });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (tokenDecoded.id) {
            req.userId = tokenDecoded.id;
            next();
        } else {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default userAuth;