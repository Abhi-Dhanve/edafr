import api from "../../../shared/hooks/api";
import { cn } from "../../../shared/utils/utils";
import { toast } from "sonner";

interface IProps {
  selectedSession: number;
}

export default function ConfirmationDrawer(props: IProps) {
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
  } = api.useSessionsList();
  const { selectedSession } = props;

  const {
    data: self,
    isLoading: selfLoading,
    isError: selfError,
  } = api.useSelfInfo();

  const createRegistration = api.useCreateRegistration();

  if (sessionsLoading || selfLoading) {
    return (
      <div className="w-full flex-center flex-col p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (sessionsError || selfError || !sessions) {
    return (
      <div className="w-full text-red-500 p-4">
        <p>Error loading data. Please try again.</p>
      </div>
    );
  }

  const session = sessions.find((s) => s.id === selectedSession);
  if (!session) {
    return (
      <div className="w-full text-red-500 p-4">
        <p>Selected session not found.</p>
      </div>
    );
  }

  const handleConfirm = async () => {
    toast.promise(
      new Promise((resolve, reject) => {
        createRegistration.mutate(
          { sessionId: selectedSession },
          {
            onSuccess: (response) => resolve(response),
            onError: (error) => reject(error),
          }
        );
      }),
      {
        loading: "Processing your registration...",
        success: () => `Successfully registered for ${session.name}!`,
        error: "Registration failed. Please try again.",
      }
    );
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-center text-2xl font-semibold">
        Confirm your choice
      </h1>

      <div className="space-y-3 mt-6">
        <div className="flex justify-between border-b pb-2 text-foreground/80">
          <span>{session.name}</span>
          <span>₹ {session.totalPrice}</span>
        </div>

        {self && (
          <div className="mt-4 text-sm text-foreground/70 border-t pt-3">
            <p>Registering as: {self.name || "Unknown"}</p>
            <p>Email: {self.email || "Unknown"}</p>
          </div>
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={createRegistration.isPending}
        className={cn(
          "mt-6 mb-2 px-4 py-2 rounded-lg",
          createRegistration.isPending
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-800"
        )}
      >
        {createRegistration.isPending ? "Processing..." : "Confirm & Register"}
      </button>
    </div>
  );
}
