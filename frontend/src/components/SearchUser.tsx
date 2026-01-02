import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

library.add(faSearch);

export default function SearchUser() {
  const [searchedUser, setSearchedUser] = useState<string>("");
  const [searchedUserList, setSearchedUserList] = useState<string[]>([]);


  const loggedInUser = sessionStorage.getItem("loggedInUser");

  const navigate = useNavigate();

  useEffect(() => {
    setSearchedUser("");
    setSearchedUserList([]);
  }, []);

  const handleSearch = async () => {
    try {
      const res = await fetch("https://secure-pay-vlg7.onrender.com/api/v1/search-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchedUser }),
      });

      const data = await res.json();

      if (res.ok) {
        setSearchedUserList(data.usersList);
      } else {
        const errMessage = data.message || "User does not exists";
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
      console.log("Error Occured in user search", err);
    }
  };

  const handleSendMoney = async (username: string) => {
    navigate(`/send-money-to/${username}`);
  };

  return (
    <div>
      <div className="flex justify-center pt-24">
        <div className="relative w-72 bg-white">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search user..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchedUser}
            onChange={(e) => setSearchedUser(e.target.value)}
          />
        </div>
        <button
          className="ml-2 px-4 py-2 border text-white bg-blue-500 rounded-xl hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {searchedUserList.length > 0 && loggedInUser && (
        <div className="my-10 mx-10 space-y-4">
          {searchedUserList
            .filter((username) => username !== loggedInUser)
            .map((username) => (
              <div
                key={username}
                className="flex justify-between items-center bg-white rounded-2xl shadow-md px-6 py-4"
              >
                <h2 className="text-lg font-medium">{username}</h2>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 shadow-lg"
                  onClick={() => handleSendMoney(username)}
                >
                  Send money
                </button>
              </div>
            ))}
        </div>
      )}

     
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
      />

      </div>
  );
}
