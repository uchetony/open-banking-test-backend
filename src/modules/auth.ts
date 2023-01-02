import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const jwtSecret = process.env.JWT_SECRET;

export const hashPassword = (password) => {
    return bcrypt.hash(password, 5);
}

export const comparePasswords = (password, hash) => {
    return bcrypt.compare(password, hash);
}

export const createJWT = ({ email, id }) => {
    return jwt.sign({ email, id }, jwtSecret);
}

export const checkAuth = (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) return res.status(401).json({ message: 'Not authorized' });

    const [, token] = bearerToken.split(' ');

    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
        const user = jwt.verify(token, jwtSecret);
        req.user = user;
        next()
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}