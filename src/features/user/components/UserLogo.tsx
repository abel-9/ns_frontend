import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "#/components/ui/tooltip";
import { useAuth } from "#/contexts/AuthContext";
import { Link } from "@tanstack/react-router";

const UserLogo = () => {
  const { user } = useAuth();
  const email = user?.email;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="cursor-pointer bg-bg-light w-10 h-10 flex items-center justify-center rounded-full p-2 ring-2 ring-primary border">
          <span className="font-bold">{email?.charAt(0).toUpperCase()}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-white shadow-md">
        <ul className="w-32">
          <li className="p-1 text-black cursor-pointer hover:bg-accent/60 rounded-md font-bold text-sm">
            <Link to="/profile">Profile</Link>
          </li>

          <hr />
          <li className="p-1 text-black cursor-pointer hover:bg-accent/60 rounded-md font-bold text-sm">
            <Link to="/profile">Dashboard</Link>
          </li>
          {/* <li>Logout</li> */}
          {/* <LogoutButton /> */}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
};

export default UserLogo;
