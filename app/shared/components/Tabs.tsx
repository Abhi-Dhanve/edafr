import Icon from "./Icon";
import { NavLink } from "react-router";
import { cn } from "../utils/utils";
import { usePrivy } from "@privy-io/react-auth";
import UserAvatar from "./UserAvatar";
import api from "../hooks/api";

export default function () {
  const privy = usePrivy();

  const user = api.useSelfInfo();

  return (
    <nav className="sticky bottom-0 bg-card p-page py-3 flex justify-evenly">
      <NavLink
        to={"/home"}
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-y-1", isActive && "text-primary")
        }
      >
        <Icon name="home" className="size-6" />
        <p className="text-xxs">Home</p>
      </NavLink>

      <NavLink
        to={"/register"}
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-y-1", isActive && "text-primary")
        }
      >
        <Icon name="calendar-fold" className="size-6" />
        <p className="text-xxs">Register</p>
      </NavLink>

      <NavLink to={"/history"} className="flex flex-col items-center gap-y-1">
        <Icon name="history" className="size-6" />
        <p className="text-xxs">History</p>
      </NavLink>

      <button
        className="flex flex-col items-center gap-y-1 relative"
        onClick={() => {
          !privy.authenticated && privy.login();
        }}
      >
        {user.data?.name ? (
          <UserAvatar className="rounded-full size-6" name={user.data?.name} />
        ) : (
          <Icon name="user" className="size-6" />
        )}
        <p className="text-xxs">Account</p>
      </button>
    </nav>
  );
}
