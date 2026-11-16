import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

const signToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN || "3d",});

};
export const register = async (req, res) => {
    try {
        const{name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:"name, email and passwords are required"
            });
        }

        const exist = await User.findOne({email:email.toLowerCase() });
        if(exist){
            return res.status(409).json({
                message: "user already registered with this email"
            });
        }
        const user = await User.create({
            name, 
            email:email.toLowerCase(),
            password,
        })
        const token = signToken(user._id);
        res.status(201).json({
            success:true, token, user
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user || !(await user.matchedPassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = signToken(user._id);
        res.json({ success: true, token, user });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

