import { useContext, useState } from "react"
import assets from "../assets/assets"
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [currState,setCurrState] = useState("SignUp");
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [bio,setBio] = useState("");
  const [isDataSubmitted,setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const onSubmitHandler =async (event) =>{
    event.preventDefault();

    if(currState ==="SignUp" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }
    const success = await login(currState === "SignUp" ? 'signup' : 'login',{fullName,email,password,bio});
    if(success){
      navigate("/");
    }
  }


  return (
    <div className="w-[75%] h-[90%]">
      <div className="h-full bg-cover bg-center flex items-center justify-center flex-1 gap-80 backdrop-blur-2xl rounded-4xl "> 
        <img src={assets.logo_big} alt="" className="w-[min(35vw,300px)]" />


        {/* form */}
        <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg" action="">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && <img src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" onClick={() => setIsDataSubmitted(false)} />}
          
        </h2>
        {currState === "SignUp" && !isDataSubmitted && (<input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder="Full Name" required />)}
        {!isDataSubmitted && (
          <>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="email address" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="password" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required/>
          </>
        )}
        {currState ==="SignUp" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} id="" placeholder="provide a short bio..." required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        )}
         <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" className="" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer" >
          {currState === "SignUp" ? "Create Account" : "Login"}
        </button>

        <div className="flex flex-col gap-2">
          {currState ==="SignUp" ?(
            <p onClick={()=>setCurrState("Login")} className="text-sm text-gray-500">Already have an account? <span className="font-medium text-violet-500 cursor-pointer">Login here</span></p>
          ) : (
            <p onClick={()=>setCurrState("SignUp")} className="text-sm text-gray-500">Don't have an account.  <span className="font-medium text-violet-500 cursor-pointer">Click here</span></p>
          )}
        </div>
        </form>


      </div>
    </div>
  )
}

export default LoginPage;