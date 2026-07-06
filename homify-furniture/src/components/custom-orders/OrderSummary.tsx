import { OrderDetails } from "@/types/custom-orders";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/custom-orders";

interface OrderSummaryProps {
  order: OrderDetails;
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Order Summary</h2>
        <Badge className={STATUS_COLORS[order.status]}>
          {STATUS_LABELS[order.status]}
        </Badge>
      </div>

      {/* Images */}
      {order.images && order.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {order.images.map((img, i) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt={`Reference ${i + 1}`}
              className="w-full h-40 object-cover rounded-lg border border-border"
            />
          ))}
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          Description
        </h3>
        <p className="text-sm">{order.description}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {order.dimensions && (
          <div>
            <span className="text-muted-foreground">Dimensions:</span>
            <p className="font-medium">{order.dimensions}</p>
          </div>
        )}
        {order.materialPreference && (
          <div>
            <span className="text-muted-foreground">Material:</span>
            <p className="font-medium">{order.materialPreference}</p>
          </div>
        )}
        {order.colorPreference && (
          <div>
            <span className="text-muted-foreground">Color:</span>
            <p className="font-medium">{order.colorPreference}</p>
          </div>
        )}
        {order.budgetMax && (
          <div>
            <span className="text-muted-foreground">Budget:</span>
            <p className="font-medium">KES {order.budgetMax}</p>
          </div>
        )}
        {/* {order.timeline && (
          <div>
            <span className="text-muted-foreground">Timeline:</span>
            <p className="font-medium">{order.timeline}</p>
          </div>
        )} */}
      </div>

      <p className="text-xs text-muted-foreground">
        Submitted on{" "}
        {new Date(order.createdAt).toLocaleDateString("en-KE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
};
