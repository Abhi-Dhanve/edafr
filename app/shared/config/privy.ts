import { PrivyClientConfig } from "@privy-io/react-auth";

export const privyConfig: PrivyClientConfig = {
    appearance: {
        logo: "/branding.png",
        theme: "dark",
    },
    // Dont Create embedded wallets for anyone -> Web3 independant auth
    embeddedWallets: {
        createOnLogin: "off",
    },
};
