import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import Icon, { IconType } from "./Icon";
import { NavLink } from "react-router";
import { cn } from "../utils/utils";

export default function () {
  const clerk = useClerk();

  return (
    <nav className="sticky bottom-0 bg-card p-page py-3 flex justify-evenly">
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-y-1", isActive && "text-primary")
        }
      >
        <Icon name="home" className="size-6" />
        <p className="text-xxs">Home</p>
      </NavLink>

      <NavLink to={"/session"} className="flex flex-col items-center gap-y-1">
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
          !clerk.isSignedIn && clerk.openSignIn({forceRedirectUrl: "/"});
        }}
      >
        {clerk.user?.hasImage ? (
          <img src={clerk.user?.imageUrl} className="size-6 rounded-full" />
        ) : (
          <Icon name="user" className="size-6" />
        )}
        <p className="text-xxs">Account</p>

        <SignedIn>
          <div className="z-1 absolute inset-0 flex justify-center items-center opacity-0">
            <div className="scale-150">
              <UserButton />
            </div>
          </div>
        </SignedIn>
      </button>
    </nav>
  );
}
