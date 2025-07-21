// FUNCTION TO GENERATE TOKEN

import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    return token;
}

// signin using userID so when decoded it give back the userID, iat, exp