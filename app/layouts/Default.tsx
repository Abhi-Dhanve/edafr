import { Outlet } from "react-router";
import axios from "axios";
import { useEffect } from "react";
import Tabs from "../shared/components/Tabs";
import { usePrivy } from "@privy-io/react-auth";
import { cn } from "../shared/utils/utils";

export default function () {
  const privy = usePrivy();

  useEffect(() => {
    if (privy.init && privy.authenticated) {
      privy.getAccessToken().then((token) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      });
    }
  }, [privy.init, privy.authenticated]);
  return (
    <main className="h-screen flex flex-col relative">
        <div className={cn("flex-1 overflow-y-scroll pb-[10vh] duration-300", !privy.ready && "scale-50 saturate-50 opacity-0")}> 
          <Outlet />
        </div>

      <Tabs />
    </main>
  );
}
