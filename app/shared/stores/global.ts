import { useEffect } from "react";
import { create } from "zustand";
import api from "../hooks/api";

interface IGlobalState {
    clerkPublishableKey: string;
    init: boolean;
    actions: {
        setClerkPublishableKey: (key: string) => void;
        initialize: () => void;
    };
}

const useGlobalStore = create<IGlobalState>()((set) => ({
    clerkPublishableKey: "",
    init: false,
    actions: {
        setClerkPublishableKey: (key) => set({ clerkPublishableKey: key }),
        initialize: () => set({ init: true }),
    },
}));

export const useGlobalStoreActions = () =>
    useGlobalStore((state) => state.actions);

export const useServerConfig = () => {
    const globalStore = useGlobalStore();

    const serverStats = api.useStats();

    useEffect(() => {
        if (serverStats.data) {
            globalStore.actions.setClerkPublishableKey(
                serverStats.data.clerkPublishableKey,
            );
            globalStore.actions.initialize();
        }
    }, [serverStats.data]);

    return {
        clerkPublishableKey: globalStore.clerkPublishableKey,
        loading: (serverStats.isLoading || !globalStore.init ||
            !globalStore.clerkPublishableKey),
    };
};
