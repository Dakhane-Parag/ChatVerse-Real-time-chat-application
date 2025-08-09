import { children, createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";


export const ChatContext = createContext();

export const ChatProvider =({children})=>{
  
  const[messages,setMessages] = useState([]);
  const[users,setUsers] = useState([]);
  const[selectedUser,setSelectedUser] = useState(null);
  const[unseenMessages,setUnseenMessages] = useState({});

  const{socket,axios} = useContext(AuthContext);
  
  useEffect(() => {
  if (selectedUser) {
    getMessages(selectedUser._id);
  }
}, [selectedUser]);


  const getUsers = async() =>{
    try {
    const{data} =   await axios.get("/api/messages/users");
    if(data.success){
      setUsers(data.users);
      setUnseenMessages(data.unseenMessages);
    }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getMessages = async(userId) =>{
    try {
      const{data} = await axios.get(`/api/messages/${userId}`);
      if(data.success){
        setMessages(data.messages)
      }
  }catch (error) {
      toast.error(error.message);
    }
  }

  const sendMessage = async(messageData) =>{
    try {
      const{data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
      if(data.success){
        setMessages((prevMessages) =>[...prevMessages,data.newMessage]);
        socket.emit("send-message", {
        receiverId: selectedUser._id,
        message: data.newMessage
        });

      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const subscibeToMessages = async() =>{
    if(!socket) return;

    socket.on("newMessage",(newMessage)=>{
      if(selectedUser && newMessage.senderId === selectedUser._id){
        newMessage.seen =true;
        setMessages((prevMessages)=>[...prevMessages,newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`)
      }else{
        setUnseenMessages((prevUnseenMessages) =>({...prevUnseenMessages,[newMessage.senderId]:prevUnseenMessages[newMessage.senderId]?prevUnseenMessages[newMessage.senderId] +1:1}))
      }
    })
  }

  useEffect(() => {
  subscibeToMessages();
  return () => unsubscribeFromMessages();
}, [socket, selectedUser]);

const unsubscribeFromMessages = () => {
  if (socket) socket.off("newMessage");
};


  const value = {
    getUsers,
    getMessages,
    sendMessage,
    messages,
    users,
    selectedUser,
    setMessages,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages
  }

  return(
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}