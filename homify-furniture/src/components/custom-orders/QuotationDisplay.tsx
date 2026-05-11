import { Quote } from "@/types/custom-orders";
import { DollarSign, Truck, FileText } from "lucide-react";

interface QuotationDisplayProps {
  quote: Quote;
}

export const QuotationDisplay = ({ quote }: QuotationDisplayProps) => {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold">Quotation</h2>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary">
              {quote.currency} {quote.amount.toLocaleString()}
            </p>
          </div>
        </div>

        {quote.deliveryInfo && (
          <div className="flex items-start gap-3 py-3 border-t border-border">
            <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Delivery</p>
              <p className="text-sm text-muted-foreground">
                {quote.deliveryInfo}
              </p>
            </div>
          </div>
        )}

        {quote.notes && (
          <div className="flex items-start gap-3 py-3 border-t border-border">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{quote.notes}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">
          Quoted on{" "}
          {new Date(quote.createdAt).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};
