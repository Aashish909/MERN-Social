import jwt from 'jsonwebtoken';


const generateToken = async(id, res)=>{
    const Token  = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    res.cookie('token', Token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });
}

export default generateToken;