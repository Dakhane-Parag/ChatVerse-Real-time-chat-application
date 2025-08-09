import cloudinary from "../lib/cloudinary.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import {io,userSocketMap} from "../server.js"

export const getUserBySidebar = async(req,res) =>{
  try{
    const userId = req.user._id;
    const filteredUsers = await userModel.find({_id:{$ne:userId}}).select("-password");

    const unseenMessages ={}
      const promises = filteredUsers.map(async(user) =>{
        const messages = await messageModel.find({senderId:user._id,receiverId: userId,seen:false});
        if(messages.length>0){
          unseenMessages[user._id] = messages.length;
        }
      });
      await Promise.all(promises);
      res.json({success:true, users:filteredUsers,unseenMessages});
    
  }
  catch(error){
    console.log(error.message);
    res.json({success:false,message:error.message})
    
  }
}

export const getMessages = async(req,res) =>{
  try {
    const{id:selectedUserId} = req.params;
    const myId = req.user._id;

    const messages = await messageModel.find({$or:[
      {senderId:myId,receiverId:selectedUserId},
      {senderId:selectedUserId,receiverId:myId}
    ]});
    await messageModel.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true})

    res.json({success:true,messages});
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}

export const markMessageAsSeen = async(req,res) =>{
  try {
    const{id} =req.params;
    await messageModel.findByIdAndUpdate(id,{seen:true});
    res.json({success:true});
  } catch (error) {
     console.log(error.message);
    res.json({success:false,message:error.message})
  }
}

export const sendMessage = async(req,res) =>{
  try {
    const {text,image} = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imgURL;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgURL = uploadResponse.secure_url;
    }
    const newMessage = await messageModel.create({senderId,receiverId,text,image:imgURL});
    const receiverSocketId = userSocketMap[receiverId];
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.json({success:true,newMessage})

  } catch (error) {
     console.log(error.message);
    res.json({success:false,message:error.message})
  }
}

