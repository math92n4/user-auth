import "dotenv/config";
import jwt from 'jsonwebtoken'


export function generateAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET)
}

export function authenticateToken(cookie) {
    return jwt.verify(cookie, process.env.TOKEN_SECRET);
}