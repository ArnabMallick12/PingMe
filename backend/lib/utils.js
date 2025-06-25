import jwt from 'jsonwebtoken';


export const generateToken = (userId,res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("token",token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: true, // Set to true if using https
        sameSite: 'none', 
    })

    return token;
}