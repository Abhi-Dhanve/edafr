import Icon from "./Icon";
import { NavLink } from "react-router";
import { cn } from "../utils/utils";
import { usePrivy } from "@privy-io/react-auth";
import UserAvatar from "./UserAvatar";
import api from "../hooks/api";
import ControlledDrawer from "./ControlledDrawer";
import { useState } from "react";

export default function () {
  const privy = usePrivy();

  const user = api.useSelfInfo();
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);

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
          privy.authenticated ? setAccountDrawerOpen(true) : privy.login();
        }}
      >
        {privy.user?.google?.name ? (
          <UserAvatar className="size-6 rounded-full" name={privy.user?.google?.name} />
        ) : (
          <Icon name="user" className="size-6" />
        )}
        <p className="text-xxs">Account</p>
      </button>

      <ControlledDrawer openState={[accountDrawerOpen, setAccountDrawerOpen]}>
        {user.data && <ProfileDrawer />}
      </ControlledDrawer>
    </nav>
  );
}
// payment method, time , amount , sesiions array obj specific price, download button 