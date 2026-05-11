import { useState } from "react";
import { CustomOrderStatus } from "@/types/custom-orders";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";

interface QuoteActionsProps {
  status: CustomOrderStatus;
  onAccept: () => void;
  onRequestAdjustment: (message: string) => void;
  onDecline: () => void;
}

export const QuoteActions = ({
  status,
  onAccept,
  onRequestAdjustment,
  onDecline,
}: QuoteActionsProps) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentMessage, setAdjustmentMessage] = useState("");

  if (status === "REJECTED") {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 text-center">
        <X className="h-10 w-10 mx-auto text-destructive mb-3" />
        <h3 className="font-semibold text-lg">Request Closed</h3>
        <p className="text-sm text-muted-foreground mt-1">
          This custom order request has been declined.
        </p>
      </div>
    );
  }

  if (status === "APPROVED" || status === "CONVERTED_TO_ORDER") {
    return (
      <div className="bg-success/5 border border-success/20 rounded-lg p-6 text-center">
        <Check className="h-10 w-10 mx-auto text-success mb-3" />
        <h3 className="font-semibold text-lg">Quote Approved!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {status === "CONVERTED_TO_ORDER"
            ? "Your order has been created and is being processed."
            : "We'll contact you shortly with delivery and payment details."}
        </p>
      </div>
    );
  }

  if (status === "EXPIRED") {
    return (
      <div className="bg-muted rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">
          This quote has expired. Please submit a new custom order request.
        </p>
      </div>
    );
  }

  if (status === "SUBMITTED" || status === "UNDER_REVIEW") {
    return (
      <div className="bg-secondary/50 rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Your request is being reviewed. We'll prepare a quote for you soon.
        </p>
      </div>
    );
  }

  // QUOTED or NEGOTIATION — show action buttons
  return (
    <>
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold">What would you like to do?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => setShowAcceptModal(true)}
          >
            <Check className="h-5 w-5 mr-2" />
            Accept Quote
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => setShowAdjustModal(true)}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Request Adjustment
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
            onClick={() => setShowDeclineModal(true)}
          >
            <X className="h-5 w-5 mr-2" />
            Decline
          </Button>
        </div>
      </div>

      {/* Accept Modal */}
      <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept This Quote?</DialogTitle>
            <DialogDescription>
              By accepting, you agree to the quoted amount. Our team will reach
              out to arrange delivery and payment details.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onAccept();
                setShowAcceptModal(false);
                toast.success("Quote accepted! We'll contact you shortly.");
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Yes, Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjustment Modal */}
      <Dialog open={showAdjustModal} onOpenChange={setShowAdjustModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Adjustment</DialogTitle>
            <DialogDescription>
              Tell us what you'd like changed — price, materials, design, or
              anything else.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={adjustmentMessage}
            onChange={(e) => setAdjustmentMessage(e.target.value)}
            placeholder="e.g., Can you reduce the price? Or use a different material?"
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdjustModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!adjustmentMessage.trim()) return;
                onRequestAdjustment(adjustmentMessage.trim());
                setShowAdjustModal(false);
                setAdjustmentMessage("");
                toast.success("Your message has been sent to our team.");
              }}
              disabled={!adjustmentMessage.trim()}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Modal */}
      <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline This Quote?</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline? This will close your custom
              order request. You can always submit a new request later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeclineModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDecline();
                setShowDeclineModal(false);
                toast.info("Quote declined. Feel free to submit a new request anytime.");
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Yes, Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
