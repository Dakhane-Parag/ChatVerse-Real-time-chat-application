import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs"

export const signup = async(req,res) =>{
  const{email,fullName,password,bio} = req.body;

  try {
    if(!email || !fullName || !password || !bio){
      return res.json({success:false,message:"Missing Details"});
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists!" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = await userModel.create({email,fullName,password:hashedPassword,bio});
    const token = generateToken(newUser._id);

    return res.json({success:true,message:"SignUp done successfully!",token,userData:newUser});

  } catch (error) {
      console.log(error.message);
      return res.json({success:false,message:error.message});
  }
  
}

export const login = async(req,res) =>{
  try {
    const{email,password} = req.body;

    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }
    const isPassCorrect = await bcrypt.compare(password,user.password);

    if(!isPassCorrect){
      return res.json({success:false,message:"Invalid Credentials!"});
    }
    const token = generateToken(user._id);
    return res.json({success:true,message:"Login Successful!",token,userData:user});
  } catch (error) {
     console.log(error.message);
      return res.json({success:false,message:error.message});
  }
}



export const checkAuth = (req,res) =>{
  res.json({succes:true,user:req.user});
}



export const updateProfile = async(req,res) =>{
  try {
    const {profilePic,bio,fullName} = req.body;
    const userId = req.user._id;
    let updatedUser;

  if(!profilePic) {
    updatedUser = await userModel.findByIdAndUpdate(userId,{bio,fullName},{new:true});
  }else{
    const upload = await cloudinary.uploader.upload(profilePic);
    updatedUser = await userModel.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});
  }
  return res.json({success:true,user:updatedUser});
  } catch (error) {
    console.log(error);
      return res.json({success:false,message:error.message});

    
  }
}