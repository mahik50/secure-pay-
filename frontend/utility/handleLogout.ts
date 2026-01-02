import { toast } from "react-toastify";

export const handleLogout = async () => {
  
  try {
    console.log("Entered handlelogout");

    const res = await fetch("https://secure-pay-vlg7.onrender.com/api/v1/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      const resMessage = data.message || "Logged Out";
      toast.error(resMessage, {
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
      alert(resMessage);
      sessionStorage.clear();
      

    } else {
      const errMessage = data.message || "Error occurred in user logging out";
      alert(errMessage);
    }
  } catch (err) {
    console.log("Error occured, Logout Failed", err);
  }
};
