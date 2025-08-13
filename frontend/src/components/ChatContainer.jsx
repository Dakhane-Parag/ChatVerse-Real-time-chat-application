import React, { useEffect, useRef ,useContext,useState} from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/util";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const ChatContainer = () => {

  const{messages,selectedUser,setSelectedUser,sendMessage,getMessages,setMessages} = useContext(ChatContext);
  const{authUser,onlineUsers,socket,loading} = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!authUser) return <div>Please log in to view chats.</div>;

  const[input,setInput] = useState('');

  const handleSendMessage =async(e)=>{
    e.preventDefault();
    if(input.trim() === " ") return ;

    await sendMessage({text:input.trim()});
    setInput("");
  }

  const handleSendImage = async(e) =>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image file")
      return;
    }

    const reader = new FileReader();
    reader.onload = async () =>{
       console.log("Sending image base64: ", reader.result);
      await sendMessage({image:reader.result});
      e.target.value ="";
    }
    reader.readAsDataURL(file);
  }

  useEffect(() => {
  socket.on("receive-message", (data) => {
    setMessages((prev) => [...prev, data.message]);
  });

  return () => socket.off("receive-message");
}, [socket]);


  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser]);

  const scrollEnd = useRef();
  useEffect(() =>{
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])
  return selectedUser ? (
    <div className="h-full relative overflow-scroll backdrop-blur-lg">
      <div className="flex items-center gap-3 border-b border-stone-500 py-3 mx-4">
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="arrowIcon"
          className="max-w-7 cursor-pointer"
        />
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className="w-10 h-10 object-cover rounded-full" />
        <p className="flex items-center gap-2 text-lg text-white flex-1">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id ) && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
        </p>

        <img src={assets.help_icon} alt="" className="max-w-5" />
      </div>

      <div className="flex flex-col h-[calc(100%-140px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => 
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8" />
            ):(
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
            )}
            <div className="text-center text-xs">
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic||assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover"/>
              <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
            </div>

          </div>
        )}
        <div ref={scrollEnd}></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3"> 
        <div className="flex flex-1 items-center bg-gray-100/12 px-3 rounded-full">
          <input onChange={(e) =>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key ==="Enter" ? handleSendMessage(e):null} type="text" placeholder="Send a message" className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"/>
          <input onChange={handleSendImage} type="file" id='image' accept="image/png, image/jpeg, image/jpg" hidden />
          <label htmlFor="image"><img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" /></label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt=""className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-3 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="w-24" />
      <p className="font-bold text-lg text-white">
        Chat karlo sare dost milkar aik sath!
      </p>
      <p className="text-s text-white">Maje karo!</p>
    </div>
  );
};

export default ChatContainer;
