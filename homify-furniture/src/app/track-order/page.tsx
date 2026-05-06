"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type TrackOrderResponse = {
  success: boolean;
  error: { message: string } | null;
  data: {
    order: {
      id: string;
      status: string;
      emailVerified: boolean;
      customerName: string | null;
      category: string | null;
      createdAt: string;
      updatedAt: string;
      trackingExpiresAt: string | null;
    };
  } | null;
};

type OrderDetails = {
  id: string;
  status: string;
  emailVerified: boolean;
  customerName: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  trackingExpiresAt: string | null;
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (!token) {
      setError(
        "Missing tracking token. Please use the full tracking link from your email.",
      );
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setOrder(null);

      try {
        const response = await fetch(`/api/custom-order/track?token=${token}`);
        const result = (await response.json()) as TrackOrderResponse;

        if (!response.ok || !result.success || !result.data?.order) {
          throw new Error(
            result?.error?.message || "Failed to track this order.",
          );
        }

        if (!active) {
          return;
        }

        setOrder(result.data.order);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to track this order.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto w-full max-w-2xl rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Track Your Order
        </h1>

        {loading ? (
          <p className="mt-4 text-slate-600">Loading order details...</p>
        ) : null}

        {error ? <p className="mt-4 text-red-700">{error}</p> : null}

        {order ? (
          <div className="mt-6 space-y-2 text-slate-700">
            <p>
              <span className="font-medium text-slate-900">Order ID:</span>{" "}
              {order.id}
            </p>
            <p>
              <span className="font-medium text-slate-900">Status:</span>{" "}
              {order.status}
            </p>
            <p>
              <span className="font-medium text-slate-900">Customer:</span>{" "}
              {order.customerName || "Not provided"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Category:</span>{" "}
              {order.category || "Not provided"}
            </p>
            <p>
              <span className="font-medium text-slate-900">Submitted:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium text-slate-900">Last updated:</span>{" "}
              {new Date(order.updatedAt).toLocaleString()}
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
