import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MINUTE } from "../config/constants";
import { usePrivy } from "@privy-io/react-auth";
 
const api = {
  useStats: () =>
    useQuery({
      queryKey: ["stats"],
      queryFn: async () => {
        const res = await axios.get<{ clerkPublishableKey: string }>("/stats");
        return res.data;
      },
      staleTime: 10 * MINUTE,
    }),

  useSelfInfo: () => {
    const privy = usePrivy();
    return useQuery({
      queryKey: ["self-info", privy.user?.id],
      queryFn: async () => {
        const res = await axios.get<{ user: { privyId: string; name: string; email: string } }>("/user/self");

        if (res.status === 424) {
          return {
            privyId: privy.user?.id,
            name: privy.user?.google?.name,
            email: privy.user?.email?.address || privy.user?.google?.email,
            status: -1,
          };
        }
        return { ...res.data.user, status: 0 };
      },
      enabled: !!privy.user?.id,
      staleTime: 60 * MINUTE,
    });
  },

  useCreateSelfUser: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ name }: { name: string }) => {
        const res = await axios.post("/user/self", { name });
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["self-info"] });
      },
    });
  },

  useSessionsList: () => {
    return useQuery({
      queryKey: ["sessions"],
      queryFn: async () => {
        const res = await axios.get<{
          sessions: Array<{ id: number; name: string; unitPrice: number; billedPer: string }>;
        }>("/sessions/list");
        return res.data.sessions;
      },
      staleTime: 10 * MINUTE,
    });
  },

  usePermitedSession: () => {
    return useQuery({
      queryKey: ["history"],
      queryFn: async () => {
        const res = await axios.get<{
          sessions: Array<{ 
            sessionIds: Array<{ sessionId: number; quantity: number }>;
            createdAt: string;
          }>;
        }>("/payment/list");
  
        return res.data.sessions.map(session => ({
          ...session,
          sessionIds: session.sessionIds.map(s => ({
            sessionId: Number(s.sessionId) + 1, 
            quantity: s.quantity,
          })),
        }));
      },
      staleTime: 10 * MINUTE,
    });
  },
  
  useCreatePayment: () => {
    return useMutation({
      mutationFn: async ({ name, email, selectedSessionsArr }: {
        name: string;
        email: string;
        selectedSessionsArr: Array<{ sessionId: number; quantity: number }>;
      }) => {
        const res = await axios.post("/payment/create", {
          name,
          email,
          sessionIds: selectedSessionsArr,
          paymentStatus: "paid",
        });
        return res.data;
      },
    });
  },

  useCreateSession: () => {
    return useMutation({
      mutationFn: async ({ name, unitPrice, billedPer }: {
        name: string;
        unitPrice: number;
        billedPer: string;
      }) => {
        const res = await axios.post("/sessions/create", { name, unitPrice, billedPer });
        return res.data;
      },
    });
  },

  useAllUsers: () => {
    return useQuery({
      queryKey: ["Users"],
      queryFn: async () => {
        const res = await axios.get<{
          users: Array<{ id: number; createdAt: string; name: string; email: string }>;
        }>("/user/all");
        return res.data.users;
      },
      staleTime: 10 * MINUTE,
    });
  },

  useDeleteUser: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (userId: number) => {
        const res = await axios.delete(`/user/${userId}`);
        return res.data;
      },
      onSuccess: () => {

        console.log("User deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["Users"] });
      },
      onError: (error) => {
        console.error("Failed to delete user:", error);
      },
    });
  },

  useDisableSession: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (sessionId: number) => {
        const res = await axios.delete(`/sessions/delete/${sessionId}`);
        return res.data;
      },
      onSuccess: () => {
        console.log("Session deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
      },
      onError: (error) => {
        console.error("Failed to delete session:", error);
      },
    });
  },

};

export default api;
