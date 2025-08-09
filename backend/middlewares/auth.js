import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'


//this function is used to authenticate a user : when user is trying to send a request to the server it authenticates the user that the person who is making the request is the person who is actually logged in and no other as it is a protected route and can be only accessed by verified user .

export const protectRoute = async (req,res,next) =>{
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("-password");

    if(!user) return res.json({success:false,message:"User not Found!"});

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    return res.json({success:false,message:error.message});
  }
}