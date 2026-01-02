import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  
  const navigate = useNavigate();

  const handleLogin = async () => {
    try{
        const res = await fetch("http://localhost:4000/api/v1/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            credentials: "include",
            body: JSON.stringify({username, password})
        })

        const data = await res.json()

        if(res.ok){
            const resMessage = data.message || "User logged in successfully"
            toast.success(resMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                //   transition: Bounce,
            });
            sessionStorage.setItem("loggedInUser", username);
            navigate("/search-user")
        }
        else{
            const errMessage = data.message || "Error occurred in user logging"
            toast.error(errMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                //   transition: Bounce,
            });
        }
    }
    catch(e){
        console.log("Error occurred in user logged in")
    }
  }

  const handleSignup = async () => {
    navigate("/")
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex-col w-full max-w-md rounded-2xl p-8 shadow-lg bg-white">

        <h2 className="text-center font-bold text-2xl text-gray-800 mb-6">Paytm</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 font-medium px-2">
            Username
          </label>
          <input
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ring-blue-500"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
            <label className="px-2 text-sm font-medium text-gray-600">Password</label>
            <input 
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ring-blue-500"
                type="password"
                placeholder="Enter you Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
            />
        </div>

        {/* Button */}
        <div>
            <button 
                className="w-full bg-blue-500 text-white rounded-xl py-2 hover:bg-blue-600 transition hover:font-medium"
                onClick={handleLogin}
            >
                Login
            </button>
            <p className="py-1 text-center text-sm font-medium text-gray-600">
                or
            </p>
            <button 
                className="w-full py-2 text-center text-gray-800 border rounded-xl hover:text-white hover:bg-blue-600 transition hover:font-medium"
                onClick={handleSignup}
            >
                Signup
            </button>
        </div>

      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // transition={Bounce}
      />
    </div>
  );
}
