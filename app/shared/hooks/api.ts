import { useMutation, useQuery } from "@tanstack/react-query";
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
                    privyId: string;
                    name: string;
                    email: string;
                }>("/user/self");
                const resp = res.status === 424
                    ? {
                        privyId: privy.user?.id,
                        name: privy.user?.google?.name,
                        email: privy.user.email || privy.user.google.email,
                        status: -1,
                    }
                    : {...res.data, status: 0};

                return resp;
            },
            enabled: !!privy.user?.id,
            staleTime: 60 * MINUTE,
        });
    },

    useCreateSelfUser: () => {
        return useMutation({
            mutationFn: async (args: { name: string }) => {
                const { name } = args;

                const res = await axios.post("/user/self", {
                    name,
                });
                return res.data;
            },
        });
    },
};

export default api;
