import { Drawer } from "vaul";
import Icon from "../../../shared/components/Icon";
import {
  calculateSessionDates,
  formatDayName,
} from "../../../shared/utils/utils";
import { PaymentHistoryItem } from "./SessionCard";
import api from "../../../shared/hooks/api";
import downloadReceipt from "../utils/downloadReceipt";

interface InvoiceDrawerProps {
  open: boolean;
  onClose: () => void;
  session: PaymentHistoryItem;
}

export function InvoiceDrawer(props: InvoiceDrawerProps) {
  const { open, onClose, session } = props;

  const { data: user } = api.useSelfInfo();

  const { endDate } = calculateSessionDates(
    session.session.numberOfSessions,
    session.session.days,
    new Date(session.createdAt)
  );

  function onDownload() {
    downloadReceipt({
      amountPaid: session.amount,
      customerName: user?.name || "Customer Name",
      date: new Date(session.createdAt).toLocaleDateString(),
      validFrom: new Date(session.createdAt).toLocaleDateString(),
      validTill: endDate ? new Date(endDate).toLocaleDateString() : "N/A",
      sessionName: session.session.name,
    });
  }

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-background/40 backdrop-blur-sm" />
        <Drawer.Content className="flex flex-col rounded-t-xl border-t fixed bottom-0 left-0 right-0 max-h-[85vh] bg-card">
          <div className="px-4 py-3 flex justify-between items-center border-b">
            <h2 className="text-lg font-semibold">Payment Receipt</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-background/50"
            >
              <Icon name="x" className="size-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-4">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-2">
                <img
                  src="/branding.png"
                  alt="EDFA Logo"
                  className="h-16 w-auto"
                />
              </div>
              <h3 className="font-bold text-xl mb-1">EDFA</h3>
              <p className="text-foreground/70 text-sm">
                Era's Dance & Fitness Academy
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                GST: 27GAVPB5653P1ZR
              </p>
            </div>

            <div className="border-t border-b py-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">Invoice ID</span>
                <span className="font-mono">{session.paymentId}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-foreground/70">Date</span>
                <span>{new Date(session.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Customer</h4>
              <div className="bg-background/40 rounded p-3">
                <p className="font-medium">{user?.name || "Customer Name"}</p>
                <p className="text-sm text-foreground/70">
                  {user?.email || "customer@example.com"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Session Details</h4>
              <div className="bg-background/40 rounded p-3">
                <p className="font-medium">{session.session.name}</p>
                <div className="text-sm text-foreground/70 mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span>Number of Sessions</span>
                    <span>{session.session.numberOfSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days</span>
                    <span>
                      {session.session.days.map(formatDayName).join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Date</span>
                    <span>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Until</span>
                    <span>
                      {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Payment Information</h4>
              <div className="bg-background/40 rounded p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Currency</span>
                  <span>{session.currency}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Price Breakdown</h4>
              <div className="bg-background/40 rounded p-3 text-sm">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{session.amount}</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground flex items-center justify-center gap-2 mb-8"
              onClick={onDownload}
            >
              <Icon name="download" className="size-4" />
              Download Invoice PDF
            </button>

            <div className="text-center text-xs text-foreground/50 mt-4 mb-8">
              <p>Thank you for choosing EDFA!</p>
              <p className="mt-1">
                This is a digitally generated receipt. No signature required.
              </p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
