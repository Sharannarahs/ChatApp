import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../utils.js";
import cloudinary from "../lib/cloudinary.js";

// SIGNUP A NEW USER

export const signup = async (req, res) => {
    const {fullName, email, password, bio} = req.body;

    try{
        console.log("Signup attempt received:", req.body);

        if(!fullName || !email || !password || !bio){
            console.log("Missing fields");
            return res.json({success: false, message: "Missing Details"})
        }

        const user = await User.findOne({email});

        if(user){
            console.log("Account already exists for:", email);
            return res.json({success: false, message: "Account already exist"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ fullName, email, password: hashedPassword, bio});
        console.log("New user created:", newUser);


        const token = generateToken(newUser._id);
        res.json({success: true, userData: newUser, token, message: "Account created successfully"});
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}

// FUNCTION TO LOGIN

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        console.log("Login attempt for:", email);
        
        const userData = await User.findOne({email});

        if (!userData) {
            console.log("No account found with email:", email);
            return res.json({ success: false, message: "No Account found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
       
        if(!isPasswordCorrect){
            console.log("Incorrect password for:", email);
            return res.json({success: false, message: "Invalid credentials"});
        }

        const token = generateToken(userData._id);
        res.json({success: true, userData, token, message: "Login successfully"});

    }catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// IS USER AUTHENTICATED FUNCTION USING MIDDLEWARE

export const checkAuth = (req, res) =>{
    console.log("Authenticated User:", req.user);
    res.json({success: true, user: req.user});
} 

// FUNCTION TO UPDATE USER PROFILE

export const updateProfile = async (req, res) => {
    try{
        const {profilePic, bio, fullName} = req.body;
        console.log(req.body)

        const userId = req.user._id;
        
        let updatedUser;

        if(!profilePic){
            console.log("No profilePic provided, updating only bio and fullName");
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else{
            console.log("Uploading profilePic to Cloudinary");
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true}); // new: return the updated document
        }
        console.log("Updated User:", updatedUser);
        res.json({success: true, user: updatedUser});

    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}