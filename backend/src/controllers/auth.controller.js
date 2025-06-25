import { generateToken } from "../../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../../lib/cloudinary.js";

export const signup = async (req, res) => {
    try {
        const { email, fullname, password } = req.body;
        if (!email || !fullname || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser  = new User({
            email: email,
            fullname:fullname,
            password: hashedPassword
        })
        if (newUser) {
            generateToken(newUser._id,res);
            await newUser.save();
            return res.status(201).json({
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                    fullname: newUser.fullname,
                    profilePic : newUser.profilePic,
                },
            }); 
        }
        else {
            return res.status(400).json({ message: "User not created" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" }); 
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        generateToken(user._id,res);
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullsname,
                profilePic : user.profilePic,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
};

export const logout = async (req, res) => {
    try{
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        console.log(error); 
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic) {
            return res.status(400).json({ message: "Profile pic is required!" });
        }
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }
        const uploadedImage = await cloudinary.uploader.upload(profilePic);
        console.log(uploadedImage);
        const updatedUser =  await User.findByIdAndUpdate(userId, {profilePic: uploadedImage.secure_url}, {new: true});

        res.status(200).json({message: "Profile updated successfully", user: {
            _id: updatedUser._id,
            email: updatedUser.email,
            fullname: updatedUser.fullname,
            profilePic: updatedUser.profilePic,
        }});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const chechAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error in checkAuth controlller" });  
    }
};