import { createContext, useEffect, useState } from "react";
import axios from "axios"
import {toast} from "react-hot-toast"
import {io} from "socket.io-client"
import { useNavigate } from "react-router-dom";



const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
const navigate = useNavigate();


  const[token,setToken] = useState(localStorage.getItem("token"));
  const[authUser,setAuthUser] = useState(null);
  const[socket,setSocket] = useState(null);
  const[onlineUsers,setOnlineUsers] = useState([]);

  const checkAuth =async()=>{
    try {
      const {data} = await axios("/api/auth/check");
      if(data.success){
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const login = async(state,credentials) =>{
    try {
      const {data} = await axios.post(`/api/auth/${state}`,credentials);
      if(data.success){
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token",data.token);
        toast.success(data.message);
        navigate("/");
        return true;
      }else{
        toast.error(data.message);
        return false;
      }
    }catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async() =>{
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully!");
    socket.disconnect();
    
  }
  const updateProfile = async(body) =>{
    try {
      const {data} = await axios.put("api/auth/updateProfile",body);
      if(data.success){
        setAuthUser(data.user);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  //connecting socket function
  const connectSocket = (userData) =>{
    if(!userData || socket?.connected) return;
    const newSocket = io(backendURL,{
      query:{
        userId:userData._id
      }
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers",(userIds)=>{
      setOnlineUsers(userIds)
    })
  }
  
  useEffect(()=>{
    if(token){
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  },[]);



  const value={
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    token,
    setToken

  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>  )
}