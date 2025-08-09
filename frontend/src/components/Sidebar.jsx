import { useContext, useEffect, useState } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const Sidebar = () => {
  const navigate = useNavigate();

  const[input,setInput] = useState(false);
  
  const{logout, onlineUsers} = useContext(AuthContext);
  const{selectedUser,setSelectedUser,getUsers,users,unseenMessages,setUnseenMessages} = useContext(ChatContext);
  
  const filteredUsers = input ? users.filter((user) =>user.fullName.toLowerCase().includes(input.toLowerCase())):users;
  useEffect(()=>{
    getUsers();
  },[onlineUsers])

  return (
    <div
      className={`bg-[#8185B2]/10 rounded-l-xl overflow-y-scroll h-full text-white
    p-5 ${selectedUser ? "max-md:hidden" : " "}`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.newLogo} alt="logo" className="max-h-9 " />
          <div className="relative group py-2">
            <img
              src={assets.menu_icon}
              alt="menuIcon"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 w-32 p-5 z-20 rounded-md border border-gray-300  group-hover:block hidden text-gray-100 bg-[#2e2142]">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-300" />
              <p onClick={() =>logout()} className="cursor-pointer text-sm">Log Out</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 px-5 py-2 bg-[#5b2480] rounded-full">
          <img src={assets.search_icon} alt="searchIcon" className="w-3" />
          <input
            type="text"
            placeholder="Search User..."
            onChange={(e)=>setInput(e.target.value)}
            className="bg-transparent text-xs border-none outline-none placeholder-[#c8c8c8] flex-1"
          />
        </div>
      </div>
      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user); setUnseenMessages(prev => ({...prev ,[user._id]:0}));
            }}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded-xl mb-1 cursor-pointer border border-fuchsia-700 max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-[#5e2f79]"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-green-500 text-xs">Online</span>
              ) : (
                <span className="text-red-600 text-xs"> Offline</span>
              )}
            </div>
            {unseenMessages[user._id]>0 && (
              <p className="absolute h-5 w-5 top-4 right-4 flex justify-center items-center rounded-full bg-violet-700 text-xs">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

