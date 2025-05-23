import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import "./tailwind.css";
import { useServerConfig } from "./shared/stores/global.ts";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "./shared/config/privy.ts";

const queryClient = new QueryClient();
axios.defaults.baseURL = "/api";
axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.error("Something went wrong with the server :(");
    return error;
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Providers>
        <Router />
      </Providers>
    </QueryClientProvider>
  </StrictMode>
);

function Providers(props: { children: React.ReactNode }) {
  const serverConfig = useServerConfig();

  if (serverConfig.loading) return <></>;

  return (
    <PrivyProvider appId={serverConfig.privyAppId} config={privyConfig}>
      {props.children}
    </PrivyProvider>
  );
}
