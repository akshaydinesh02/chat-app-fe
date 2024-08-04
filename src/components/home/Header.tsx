import { Link, useLocation } from "react-router-dom";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuth } from "../../hooks/Auth";
import { Button } from "../ui/button";

const Header = () => {
  const user = useAuth().user;
  console.log({ user });
  const userImage = user?.user_metadata?.picture ?? "/user-avatar-2.png";
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="py-2 px-6 bg-gradient-to-b from-indigo-300 via-indigo-200 to-transparent">
      <nav className="flex justify-between max-w-[90%] mx-auto">
        <div className="flex justify-between w-[40%] items-center font-semibold uppercase">
          <Link
            to="/"
            className={`hover:text-gray-700 ${
              pathname === "/" ? "border-b-[2px] border-indigo-500" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`hover:text-gray-700 ${
              pathname === "/dashboard"
                ? "border-b-[2px] border-indigo-500"
                : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/about"
            className={`hover:text-gray-700 ${
              pathname === "/about" ? "border-b-[2px] border-indigo-500" : ""
            }`}
          >
            About
          </Link>

          <Link
            to="/docs"
            className={`hover:text-gray-700 ${
              pathname === "/docs" ? "border-b-[2px] border-indigo-500" : ""
            }`}
          >
            Docs
          </Link>
        </div>
        {user ? (
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage
              className="rounded-full"
              src={userImage}
              alt="user-avatar"
            />
            <AvatarFallback className="flex items-center justify-center">
              USER
            </AvatarFallback>
          </Avatar>
        ) : (
          <Link to="/auth/sign-in">
            <Button className="bg-violet-400 text-black hover:bg-violet-500 hover:text-gray-100 font-semibold">
              Sign in
            </Button>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Header;
