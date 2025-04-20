import { useState } from "react";
import api from "../../shared/hooks/api";
import { calculateSessionDates } from "../../shared/utils/utils";
import Icon from "../../shared/components/Icon";
import { toast } from "sonner";
import { SessionCard, PaymentHistoryItem } from "./components/SessionCard";
import { InvoiceDrawer } from "./components/InvoiceDrawer";
import downloadReceipt from "./utils/downloadReceipt";

export default function History() {
  const { data: history, isLoading, isError } = api.usePaymentHistory();
  const { data: user } = api.useSelfInfo();
  const [selectedSession, setSelectedSession] =
    useState<PaymentHistoryItem | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [expandedSection, setExpandedSection] = useState<
    "active" | "past" | null
  >("active");

  if (isLoading) {
    return (
      <div className="p-page pt-10 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-foreground/70">Loading your session history...</p>
      </div>
    );
  }

  if (isError || !history) {
    return (
      <div className="p-page pt-10 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">Failed to load session history</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const isSessionActive = (session: PaymentHistoryItem) => {
    const { endDate } = calculateSessionDates(
      session.session.numberOfSessions,
      session.session.days,
      new Date(session.createdAt)
    );
    return endDate && new Date() <= endDate;
  };

  const activeSessions = history.filter(isSessionActive);
  const pastSessions = history.filter((session) => !isSessionActive(session));

  const toggleSection = (section: "active" | "past") => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleDownloadInvoice = (session: PaymentHistoryItem) => {
    toast.success("Invoice download started");

    const { endDate } = calculateSessionDates(
      session.session.numberOfSessions,
      session.session.days,
      new Date(session.createdAt)
    );

    downloadReceipt({
      amountPaid: session.amount,
      customerName: user?.name || "Customer Name",
      date: new Date(session.createdAt).toLocaleDateString(),
      validFrom: new Date(session.createdAt).toLocaleDateString(),
      validTill: endDate ? new Date(endDate).toLocaleDateString() : "N/A",
      sessionName: session.session.name,
    });

    setTimeout(() => {
      toast.success(
        `Invoice for ${session.session.name} downloaded successfully`
      );
    }, 1500);
  };

  if (history.length === 0) {
    return (
      <div className="p-page pt-10 flex flex-col items-center justify-center min-h-[60vh]">
        <Icon name="calendar-x" className="size-16 text-foreground/30 mb-4" />
        <h2 className="text-xl font-medium mb-2">No sessions found</h2>
        <p className="text-foreground/70 text-center mb-6">
          You haven't registered for any sessions yet.
        </p>
        <a
          href="/register"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Browse Sessions
        </a>
      </div>
    );
  }

  return (
    <div className="p-page pt-6 pb-16">
      <h1 className="text-2xl font-bold mb-6">Your Sessions</h1>

      <div className="mb-4">
        <button
          onClick={() => toggleSection("active")}
          className="w-full flex justify-between items-center py-3 px-4 bg-card rounded-t-lg border-b border-border/30"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h2 className="text-lg font-medium">Active Sessions</h2>
            <span className="ml-2 bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-xs">
              {activeSessions.length}
            </span>
          </div>
          <Icon
            name={expandedSection === "active" ? "chevron-up" : "chevron-down"}
            className="size-5"
          />
        </button>

        {expandedSection === "active" && (
          <div className="border border-t-0 rounded-b-lg p-3 bg-background/30 space-y-3">
            {activeSessions.length === 0 ? (
              <p className="text-foreground/70 text-center py-4">
                No active sessions
              </p>
            ) : (
              activeSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isActive={true}
                  onViewDetails={() => {
                    setSelectedSession(session);
                    setShowInvoice(true);
                  }}
                  onDownloadInvoice={() => handleDownloadInvoice(session)}
                />
              ))
            )}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => toggleSection("past")}
          className="w-full flex justify-between items-center py-3 px-4 bg-card rounded-t-lg border-b border-border/30"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-foreground/50"></div>
            <h2 className="text-lg font-medium">Past Sessions</h2>
            <span className="ml-2 bg-foreground/20 text-foreground/80 px-2 py-0.5 rounded-full text-xs">
              {pastSessions.length}
            </span>
          </div>
          <Icon
            name={expandedSection === "past" ? "chevron-up" : "chevron-down"}
            className="size-5"
          />
        </button>

        {expandedSection === "past" && (
          <div className="border border-t-0 rounded-b-lg p-3 bg-background/30 space-y-3">
            {pastSessions.length === 0 ? (
              <p className="text-foreground/70 text-center py-4">
                No past sessions
              </p>
            ) : (
              pastSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isActive={false}
                  onViewDetails={() => {
                    setSelectedSession(session);
                    setShowInvoice(true);
                  }}
                  onDownloadInvoice={() => handleDownloadInvoice(session)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {selectedSession && (
        <InvoiceDrawer
          open={showInvoice}
          onClose={() => setShowInvoice(false)}
          session={selectedSession}
        />
      )}
    </div>
  );
}
