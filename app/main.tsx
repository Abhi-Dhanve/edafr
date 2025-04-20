import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import "./tailwind.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "./shared/config/privy.ts";
import api from "./shared/hooks/api.ts";

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
  const conf = api.useStats();

  if (conf.isLoading)
    return (
      <div className="w-screen h-screen flex-center flex-col">
        <img src="/branding.png" alt="EDFA logo" />
        <p>Please Wait</p>
      </div>
    );

  if (conf.isError || !conf.data)
    return (
      <p className="text-red-500 bg-black w-screen text-wrap">
        {JSON.stringify(conf.error, null, 4)}
      </p>
    );

  const config = conf.data;

  return (
    <PrivyProvider appId={config.privyAppId} config={privyConfig}>
      {props.children}
    </PrivyProvider>
  );
}
