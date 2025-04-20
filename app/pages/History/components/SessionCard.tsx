import {
  DayOfWeek,
  calculateSessionDates,
  cn,
} from "../../../shared/utils/utils";
import Icon from "../../../shared/components/Icon";

interface SessionDetails {
  id: number;
  name: string;
  numberOfSessions: number;
  days: DayOfWeek[];
  totalPrice: number;
}

export interface PaymentHistoryItem {
  id: number;
  sessionId: number;
  userId: number;
  paymentId: string;
  createdAt: string;
  session: SessionDetails;
  amount: number;
  currency: string;
}

interface SessionCardProps {
  session: PaymentHistoryItem;
  isActive: boolean;
  onViewDetails: () => void;
  onDownloadInvoice: () => void;
}

export function SessionCard({
  session,
  isActive,
  onViewDetails,
  onDownloadInvoice,
}: SessionCardProps) {
  const { endDate } = calculateSessionDates(
    session.session.numberOfSessions,
    session.session.days,
    new Date(session.createdAt)
  );

  return (
    <div
      className={cn(
        "bg-card rounded-lg overflow-hidden border",
        isActive ? "border-green-500/20" : "border-border/20"
      )}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium mb-1">{session.session.name}</h3>
            <p className="text-sm text-foreground/70">
              Registered on {new Date(session.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="font-semibold">₹{session.amount}</div>
        </div>

        <div className="bg-background/40 rounded p-2 text-sm mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-foreground/70">Sessions</span>
            <span>{session.session.numberOfSessions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">Valid until</span>
            <span>
              {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-foreground/60 mb-3">
          <span>Paid </span>
          <div className="mx-1 w-1 h-1 rounded-full bg-foreground/40"></div>
          <span>{session.currency}</span>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 py-1.5 rounded border border-border bg-background/50 text-sm flex items-center justify-center gap-1"
            onClick={onViewDetails}
          >
            <Icon name="file-text" className="size-4" />
            View Details
          </button>
          <button
            className="flex-1 py-1.5 rounded bg-primary/10 text-primary text-sm flex items-center justify-center gap-1"
            onClick={onDownloadInvoice}
          >
            <Icon name="download" className="size-4" />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
