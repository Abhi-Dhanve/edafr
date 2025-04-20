import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MINUTE } from "../config/constants";
import { usePrivy } from "@privy-io/react-auth";
import apiClient from "../utils/apiClient";
import { toast } from "sonner";
import { ClientResponse } from "hono/client";

const api = {
  useStats: () =>
    useQuery({
      queryKey: ["stats"],

      queryFn: async () => {
        const res = await safeParseResponse(apiClient.stats.$get());
        return res.data;
      },

      staleTime: 60 * MINUTE,
    }),

  useSelfInfo: () => {
    const privy = usePrivy();
    const userId = privy.user?.id;
    const email = privy.user?.email?.address || privy.user?.google?.email;

    return useQuery({
      queryKey: ["self", { userId }],

      queryFn: async () => {
        if (!email) {
          toast.error("Invalid email, please contact support");
          return;
        }

        const raw = await apiClient.user.$get();
        const res = await raw.json();

        if (raw.status === 424) {
          return {
            privyId: userId,
            name: privy.user?.google?.name,
            email: email,
            status: -1,
          };
        }
        return { ...res.data.user, status: 0 };
      },

      enabled: !!userId,
      staleTime: 60 * MINUTE,
    });
  },

  useCreateSelfUser: () => {
    const privy = usePrivy();
    const userId = privy.user?.id;
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (args: { name: string }) => {
        const { name } = args;
        const res = await apiClient.user.$post({ json: { name } });
        const data = await res.json();

        if ("error" in data) {
          throw new Error(data.error);
        }

        return data.data;
      },

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["self", { userId }] });
        queryClient.refetchQueries({ queryKey: ["self", { userId }] });
      },
    });
  },

  useSessionsList: () => {
    return useQuery({
      queryKey: ["sessions"],
      queryFn: async () => {
        const res = await safeParseResponse(apiClient.sessions.$get());
        return res.data.sessions;
      },
      staleTime: 10 * MINUTE,
    });
  },

  useCreateSession: () => {
    return useMutation({
      mutationFn: async (
        args: Parameters<typeof apiClient.sessions.$post>[0]["json"]
      ) => {
        const res = await apiClient.sessions.$post({ json: args });
        const data = await res.json();
        if ("error" in data) {
          toast.error(data.error);
          return;
        }
        return data.data;
      },
    });
  },

  useAllUsers: () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const res = await safeParseResponse(apiClient.user.all.$get());
        return res.data.users;
      },
    });
  },

  useUserSessions: (userId: number) => {
    return useQuery({
      queryKey: ["user-sessions", { userId }],
      queryFn: async () => {
        const res = await safeParseResponse(
          apiClient.user[":id"].sessions.$get({
            param: { id: userId.toString() },
          })
        );
        return res.data.sessions;
      },
      enabled: !!userId,
      staleTime: 10 * MINUTE,
    });
  },

  usePaymentHistory: () => {
    return useQuery({
      queryKey: ["payment-history"],
      queryFn: async () => {
        const res = await safeParseResponse(apiClient.payment.history.$get());
        return res.data.history;
      },
      staleTime: 5 * MINUTE,
    });
  },

  useDeleteUser: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (userId: number) => {
        const res = await safeParseResponse(
          apiClient.user[":id"].$delete({ param: { id: userId.toString() } })
        );
        return res.data;
      },
      onSuccess: () => {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  },

  useDisableSession: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (sessionId: number) => {
        const res = await safeParseResponse(
          apiClient.sessions.delete[":id"].$delete({
            param: { id: sessionId.toString() },
          })
        );
        return res.data;
      },
      onSuccess: () => {
        toast.success("Session deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
      },
    });
  },

  useCreateRegistration: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ sessionId }: { sessionId: number }) => {
        const res = await apiClient.sessions.register.$post({
          json: { sessionId },
        });
        const data = await res.json();
        if ("error" in data) {
          toast.error(data.error);
          throw new Error(data.error);
        }
        return data.data;
      },
      onSuccess: () => {
        toast.success("Registration successful");
        queryClient.invalidateQueries({ queryKey: ["history"] });
        queryClient.invalidateQueries({ queryKey: ["payment-history"] });
      },
    });
  },
};

type ErrorResponse = { error: string };
async function safeParseResponse<
  T extends Record<string, unknown>,
  U extends number,
  F extends string
>(raw: Promise<ClientResponse<T | ErrorResponse, U, F>>): Promise<T> {
  const rawData = await raw;
  const res = await rawData.json();

  if ((res as ErrorResponse).error) {
    const errorMessage =
      typeof (res as ErrorResponse).error === "string"
        ? (res as ErrorResponse).error
        : "Unknown error";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  return res as T;
}

export default api;
