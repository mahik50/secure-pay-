import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { handleLogout } from "../../utility/handleLogout";

library.add(faCircleUser);

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Header() {
  const [showLogout, setShowLogout] = useState(false);
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const username = loggedInUser ? capitalize(loggedInUser) : "";
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-blue-500 flex items-center justify-between px-4 sm:px-6 shadow-md z-50">
      <nav className="flex items-center gap-3 sm:gap-6">
        <Link
          to="/search-user"
          className="text-gray-200 font-medium text-sm sm:text-lg hover:text-white"
        >
          Home
        </Link>

        <Link
          to="/show-history"
          className="text-gray-200 font-medium text-sm sm:text-lg hover:text-white"
        >
          Show History
        </Link>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3 relative">
        <span className="hidden sm:block text-white font-medium text-lg">
          {username}
        </span>

        <FontAwesomeIcon
          icon={faCircleUser}
          className="text-white text-xl sm:text-2xl cursor-pointer"
          onClick={() => setShowLogout((prev) => !prev)}
        />

        {showLogout && (
          <button
            className="absolute top-full mt-2 right-0 bg-gray-100 px-3 py-1.5 text-xs sm:text-sm rounded-md shadow-md text-gray-700 hover:bg-white hover:text-gray-900 transition"
            onClick={() => {
              handleLogout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
