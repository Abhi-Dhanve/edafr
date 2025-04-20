import { Outlet } from "react-router";
import { useEffect } from "react";
import Tabs from "../shared/components/Tabs";
import { usePrivy } from "@privy-io/react-auth";
import { cn } from "../shared/utils/utils";
import api from "../shared/hooks/api";
import { Toaster } from "sonner";
import NameDrawer from "../shared/components/NameDrawer";
import { setAuthToken } from "../shared/utils/apiClient";

export default function () {
  const privy = usePrivy();

  const user = api.useSelfInfo();

  useEffect(() => {
    if (privy.ready && privy.authenticated) {
      privy.getAccessToken().then((token) => {
        setAuthToken(`Bearer ${token}`);
        setTimeout(() => {
          user.refetch();
        }, 1000);
      });
    }
  }, [privy.ready, privy.authenticated]);

  return (
    <main className="h-screen flex flex-col relative">
      <div
        className={cn(
          "flex-1 overflow-y-scroll pb-[10vh] duration-300",
          !privy.ready && "scale-50 saturate-50 opacity-0"
        )}
      >
        <Outlet />
      </div>

      <Tabs />
      <NameDrawer open={user.data?.status === -1} />
      <Toaster richColors />
    </main>
  );
}
