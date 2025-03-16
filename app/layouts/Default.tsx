import { Outlet } from "react-router";
import { cn } from "../shared/utils/utils";
import axios from "axios";
import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  UserButton,
} from "@clerk/clerk-react";
import Tabs from "../shared/components/Tabs";

export default function () {
  const clerk = useClerk();
  // const privy = usePrivy();

  // useEffect(() => {
  //   if (privy.init && privy.authenticated) {
  //     privy.getAccessToken().then((token) => {
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //     });
  //   }
  // }, [privy.init, privy.authenticated]);

  return (
    <main className="h-screen flex flex-col relative">
      <div className="flex-1 overflow-y-scroll pb-[10vh] duration-300 motion-scale-in-[0.32]">
        <Outlet />
      </div>

      <Tabs />
    </main>
  );
}
