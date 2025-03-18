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
        {user?.data ? (
          <UserAvatar className="size-6 rounded-full" name={user.data.name} />
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

function ProfileDrawer() {
  const privy = usePrivy();
  const user = api.useSelfInfo();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-x-3">
        <UserAvatar className="rounded-full size-12" name={user.data?.name} />

        <div>
          <h3 className="flex items-center gap-x-2">
            {user.data.name} <Icon name="pen" className="size-[0.6em]" />
          </h3>

          <p className="text-sm text-foreground/70">{user.data.email}</p>
        </div>
      </div>

      <button
        className="bg-black border p-2 w-full mt-5 border-red-700/60 text-red-700 flex items-center justify-center rounded-lg gap-x-2"
        onClick={() => privy.logout().
          // again, better ways to handle this
          then(() => location.reload())}
      >
        Logout
        <Icon name="log-out" />
      </button>
    </div>
  );
}