import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MINUTE } from "../config/constants";

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
};

export default api;
