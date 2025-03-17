import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MINUTE } from "../config/constants";
import { usePrivy } from "@privy-io/react-auth";

const api = {
    useStats: () =>
        useQuery({
            queryKey: ["stats"],
            queryFn: async () => {
                const res = await axios.get<{
                    clerkPublishableKey: string;
                }>("/stats");
                return res.data;
            },
            staleTime: 10 * MINUTE,
        }),

    useSelfInfo: () => {
        const privy = usePrivy();
        return useQuery({
            queryKey: ["self-info", privy.user?.id],
            queryFn: async () => {
                const res = await axios.get<{
                    user: {
                        privyId: string;
                        name: string;
                        email: string;
                    };
                }>("/user/self");

                const resp = res.status === 424
                    ? {
                        privyId: privy.user?.id,
                        name: privy.user?.google?.name,
                        email: privy.user?.email?.address ||
                            privy.user?.google?.email,
                        status: -1,
                    }
                    : { ...res.data?.user, status: 0 };

                return resp;
            },
            enabled: !!privy.user?.id,
            staleTime: 60 * MINUTE,
        });
    },

    useCreateSelfUser: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (args: { name: string }) => {
                const { name } = args;

                const res = await axios.post("/user/self", {
                    name,
                });
                return res.data;
            },
            onSuccess: () => {
                // not the best way of handling this, fix later
                queryClient.invalidateQueries({ queryKey: ["self-info"] });
                location.reload();
            },
        });
    },

    useSessionsList: () => {
        return useQuery({
            queryKey: ["sessions"],
            queryFn: async () => {
                const res = await axios.get<{
                    sessions: Array<{
                        name: string;
                        unitPrice: number;
                        billedPer: string;
                    }>;
                }>("/sessions/list");
                return res.data.sessions;
            },
            staleTime: 10 * MINUTE,
        });
    },
};

export default api;
