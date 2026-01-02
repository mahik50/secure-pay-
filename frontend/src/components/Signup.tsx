import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Signup() {

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch("https://secure-pay-vlg7.onrender.com/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const resMessage = data.message || "User signed up successfully";
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
      } else {
        const errMessage = data.message || "Error occurred in Signing Up";
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
    } catch (err) {
      console.log("Error in use signup");
    }
  };

  const handleLogin = async () => {
    navigate("/login")
  }

  
  return (
    <div className="flex justify-center bg-gray-100 min-h-screen items-center">
      <div className="bg-white flex-col items-center shadow-lg p-8 text-black w-full max-w-md rounded-3xl ">
        <h2 className="text-2xl font-bold text-center mb-6">Paytm</h2>

        <div className="mb-4">
          <label className="text-sm text-gray-600 font-medium">Email</label>
          <input
            className="w-full border px-4 py-2 focus:outline-none focus:ring-2 ring-blue-500 rounded-xl p-2"
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Username</label>
          <input
            className="w-full border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 ring-blue-500"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ring-blue-500"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            className="bg-blue-500 text-white rounded-xl py-2 w-full text-center hover:font-semibold hover:bg-blue-600 transition "
            onClick={handleSignup}
          >
            Signup
          </button>
          <p className="text-center mt-1 mb-1 text-sm font-medium text-gray-600">
            or
            </p>
            <button 
                className=" text-gray-800 border rounded-xl py-2 w-full text-center hover:text-white hover:font-semibold hover:bg-blue-600 transition"
                onClick={handleLogin}
            >
            Login
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
