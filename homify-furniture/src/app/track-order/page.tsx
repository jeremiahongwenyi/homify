"use client";
import Link from "next/link";
import { ArrowLeft,ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useSearchParams } from "next/navigation";
import { QuotationDisplay } from "@/components/custom-orders/QuotationDisplay";
import {OrderSummary} from "@/components/custom-orders/OrderSummary"
import {QuoteActions} from "@/components/custom-orders/QuoteActions"

const quote = {
    id: "qt_001",
    orderId: "ord_12345",
    amount: 75000,
    currency: "KES",
    notes: "Includes premium oak wood finish and delivery within Nairobi.",
    deliveryInfo: "Delivery within 7–10 working days",
    createdAt: "2026-05-11T10:30:00.000Z",
  }

// import { useEffect, useState } from "react";

// type TrackOrderResponse = {
//   success: boolean;
//   error: { message: string } | null;
//   data: {
//     order: {
//       id: string;
//       status: string;
//       emailVerified: boolean;
//       customerName: string | null;
//       category: string | null;
//       createdAt: string;
//       updatedAt: string;
//       trackingExpiresAt: string | null;
//     };
//   } | null;
// };

// type OrderDetails = {
//   id: string;
//   status: string;
//   emailVerified: boolean;
//   customerName: string | null;
//   category: string | null;
//   createdAt: string;
//   updatedAt: string;
//   trackingExpiresAt: string | null;
// };

export default function TrackOrder() {
  const searchParams = useSearchParams();
  const token = (searchParams.get("token") ?? "").trim();
  const tokenError = !token
    ? "This link is invalid. Please check your email for the correct link."
    : "";

  const { data:order, isLoading, error } = useQuery({
    queryKey: ["order", token],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return api.getOrder(token as string);
    },
    enabled: !!token,
  });

  if (isLoading || error || tokenError)
    return (
      <main className="min-h-[70vh] px-4 py-16">
        <div className="mx-auto w-full max-w-2xl rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Track Your Order
          </h1>

          {isLoading ? (
            <p className="mt-4 text-slate-600">Loading order details...</p>
          ) : null}

          {error && (
            <p className="mt-4 text-red-700">
              {error instanceof Error
                ? error.message
                : "Failed to fetch order details."}
            </p>
          )}

          {tokenError && <p className="mt-4 text-red-700">{tokenError}</p>}
        </div>
      </main>
    );

      const handleAccept = () => {
   console.log("quote accepted");
   
  };

  const handleRequestAdjustment = (content: string) => {
    console.log("i need re-adjustment");
    
    // const newMsg: Message = {
    //   id: `msg_${Date.now()}`,
    //   orderId: order.id,
    //   sender: "USER",
    //   content,
    //   createdAt: new Date().toISOString(),
    // };
    // setMessages((prev) => [...prev, newMsg]);
    // setStatus("NEGOTIATION");
  };

  const handleDecline = () => {
   console.log("quote declined");
   
  };

//   const handleSendMessage = (content: string) => {
//     const newMsg: Message = {
//       id: `msg_${Date.now()}`,
//       orderId: order.id,
//       sender: "USER",
//       content,
//       createdAt: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, newMsg]);
//   };


    return (
    <main className="min-h-screen bg-background">
      {/* Header */}
       <div className="bg-primary text-primary-foreground py-8">
         <div className="container">
           <Link
          href="/customorders"
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Custom Orders
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Your Custom Order
          </h1>
          <p className="text-primary-foreground/80 mt-1">
            Order #{order.id} · {order.customerName}
          </p>
        </div>
      </div>



      <div className="container py-8">
        {/* Login Banner for guests
         {!order.userId && (
          <div className="mb-6">
            <LoginBanner onLogin={() => setShowAuthDialog(true)} />
          </div>
        )} */}

{/* //         Email verified indicator */}
      {order.emailVerified && (
          <div className="flex items-center gap-2 text-sm text-success mb-6">
            <ShieldCheck className="h-4 w-4" />
            Email verified
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Summary + Quote */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <OrderSummary order={{ ...order }} /> 
            </div>

            {quote && (
              <div className="bg-card border border-border rounded-lg p-5">
                <QuotationDisplay quote={quote} />
              </div>
            )}
          </div>

          {/* Right Column: Actions + Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Actions */}
            <div className="bg-card border border-border rounded-lg p-5">
              <QuoteActions
                status={order.status}
                onAccept={handleAccept}
                onRequestAdjustment={handleRequestAdjustment}
                onDecline={handleDecline}
              />
            </div>

            {/* Chat */}
            {/* {(status === "QUOTED" ||
              status === "NEGOTIATION" ||
              status === "UNDER_REVIEW") && (
              <div className="bg-card border border-border rounded-lg p-5">
                <OrderChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  disabled={isTerminalState}
                />
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      {/* <CheckoutAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthenticated={() => {
          setShowAuthDialog(false);
        }}
      /> */}
    </main>
  )
}

// import { mockOrders, mockQuotes, mockMessages } from "@/data/customOrders";
// import { Message } from "@/types/customOrder";
// import { OrderSummary } from "@/components/custom-orders/OrderSummary";
// import { QuotationDisplay } from "@/components/custom-orders/QuotationDisplay";
// import { OrderChat } from "@/components/custom-orders/OrderChat";
// import { QuoteActions } from "@/components/custom-orders/QuoteActions";
// import { LoginBanner } from "@/components/custom-orders/LoginBanner";
// import { CheckoutAuthDialog } from "@/components/auth/CheckoutAuthDialog";
// import { ArrowLeft, ShieldCheck } from "lucide-react";
// import { CustomOrderStatus } from "@/types/customOrder";

// const CustomOrderResponse = () => {
// const [searchParams] = useSearchParams();
// const token = searchParams.get("token");

// const order = useMemo(
//   () => mockOrders.find((o) => o.token === token),
//   [token]
// );

// const [status, setStatus] = useState<CustomOrderStatus>(
//   order?.status ?? "SUBMITTED"
// );
// const [messages, setMessages] = useState<Message[]>(
//   order ? mockMessages[order.id] ?? [] : []
// );
// const [showAuthDialog, setShowAuthDialog] = useState(false);

//   const quote = mockQuotes[order.id];


//   const isTerminalState =
//     status === "REJECTED" ||
//     status === "EXPIRED" ||
//     status === "CONVERTED_TO_ORDER";

//   return (
//     <main className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-primary text-primary-foreground py-8">
//         <div className="container">
//           <Link
//           href="/custom-order"
//             className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Custom Orders
//           </Link>
//           <h1 className="font-display text-2xl md:text-3xl font-bold">
//             Your Custom Order
//           </h1>
//           <p className="text-primary-foreground/80 mt-1">
//             Order #{order.id} · {order.name}
//           </p>
//         </div>
//       </div>

//       <div className="container py-8">
//         {/* Login Banner for guests */}
//         {!order.userId && (
//           <div className="mb-6">
//             <LoginBanner onLogin={() => setShowAuthDialog(true)} />
//           </div>
//         )}

//         {/* Email verified indicator */}
//         {order.emailVerified && (
//           <div className="flex items-center gap-2 text-sm text-success mb-6">
//             <ShieldCheck className="h-4 w-4" />
//             Email verified
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column: Summary + Quote */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-card border border-border rounded-lg p-5">
//               <OrderSummary order={{ ...order, status }} />
//             </div>

//             {quote && (
//               <div className="bg-card border border-border rounded-lg p-5">
//                 <QuotationDisplay quote={quote} />
//               </div>
//             )}
//           </div>

//           {/* Right Column: Actions + Chat */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Actions */}
//             <div className="bg-card border border-border rounded-lg p-5">
//               <QuoteActions
//                 status={status}
//                 onAccept={handleAccept}
//                 onRequestAdjustment={handleRequestAdjustment}
//                 onDecline={handleDecline}
//               />
//             </div>

//             {/* Chat */}
//             {(status === "QUOTED" ||
//               status === "NEGOTIATION" ||
//               status === "UNDER_REVIEW") && (
//               <div className="bg-card border border-border rounded-lg p-5">
//                 <OrderChat
//                   messages={messages}
//                   onSendMessage={handleSendMessage}
//                   disabled={isTerminalState}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Auth Dialog */}
//       <CheckoutAuthDialog
//         open={showAuthDialog}
//         onOpenChange={setShowAuthDialog}
//         onAuthenticated={() => {
//           setShowAuthDialog(false);
//         }}
//       />
//     </main>
//   );
// };

// // export default CustomOrderResponse;
