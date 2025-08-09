import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { useState ,useContext} from "react";
import { ChatContext } from "../../context/ChatContext.jsx";

const HomePage = () => {
    const{selectedUser} =useContext(ChatContext);
  

  return (
    <div className="h-screen w-full px-[15%] py-[4%]">
      <div
        className={`backdrop-blur-xl px-1 py-1 h-[100%] rounded-2xl border-gray-500 border grid grid-cols-1 ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <Sidebar></Sidebar>
        <ChatContainer></ChatContainer>
        <RightSidebar></RightSidebar>
      </div>
    </div>
  );
};

export default HomePage;
