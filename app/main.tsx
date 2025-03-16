import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import "./tailwind.css";
import { useServerConfig } from "./shared/stores/global.ts";
import { ClerkProvider } from "@clerk/clerk-react";

const queryClient = new QueryClient();
axios.defaults.baseURL = "/api";

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
    <ClerkProvider
      publishableKey={serverConfig.clerkPublishableKey}
      afterSignOutUrl="/"
    >
      {props.children}
    </ClerkProvider>
  );
}
