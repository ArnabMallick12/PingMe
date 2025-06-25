import jwt from 'jsonwebtoken';


export const generateToken = (userId,res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("token",token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'devlopment', // Set to true if using https
        sameSite: 'strict', // CSRF protection
    })

    return token;
}