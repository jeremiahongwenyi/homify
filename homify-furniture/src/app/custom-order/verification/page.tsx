"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SUPPORT_TEXT = "If the issue persists, contact us at 0719 352 072.";

const getStatusMessage = (status: string) => {
  switch (status) {
    case "success":
      return {
        title: "Email verified 🎉",
        description:
          "Thanks for confirming your email. Your custom order is now under review.",
        extra: "You can now track your order using the link below.",
        tone: "success",
      };

    case "already-verified":
      return {
        title: "You’re all set",
        description:
          "This email has already been verified. Your custom order is currently being reviewed.",
        extra: "You can continue tracking your order below.",
        tone: "info",
      };

    case "expired-token":
      return {
        title: "Verification link expired",
        description:
          "This link has expired for security reasons. You can request a new verification email below to continue.",
        extra: SUPPORT_TEXT,
        tone: "warning",
      };

    case "invalid-token":
      return {
        title: "Invalid verification link",
        description:
          "This link is not valid or may have been altered. Please use the full tracking link from your email.",
        extra: SUPPORT_TEXT,
        tone: "error",
      };

    case "missing-token":
      return {
        title: "Verification link incomplete",
        description:
          "This verification link is missing required information. Please use the full tracking link from your email.",
        extra: SUPPORT_TEXT,
        tone: "error",
      };

    default:
      return {
        title: "Something went wrong",
        description:
          "We couldn’t verify your email right now. Please try again shortly.",
        extra: SUPPORT_TEXT,
        tone: "error",
      };
  }
};

export default function VerificationResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "server-error";
  const token = searchParams.get("token");
  const trackingToken = searchParams.get("trackingToken");
  const trackingUrl = trackingToken ? `/track-order?token=${trackingToken}` : null;

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const details = useMemo(() => getStatusMessage(status), [status]);
  const canResend = status === "expired-token" && !!token;
  const canTrack =
    (status === "success" || status === "already-verified") && !!trackingUrl;

  const handleResend = async () => {
    if (!token || resendLoading) {
      return;
    }

    setResendLoading(true);
    setResendMessage(null);
    setResendError(null);

    try {
      const response = await fetch("/api/custom-order/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.error?.message ||
            "We could not resend the verification email. Please try again.",
        );
      }

      setResendMessage(
        result?.data?.message || "A new verification email has been sent.",
      );
    } catch (error) {
      setResendError(
        error instanceof Error
          ? error.message
          : "We could not resend the verification email. Please try again.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto w-full max-w-2xl rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          {details.title}
        </h1>
        <p className="mt-3 text-slate-700">{details.description}</p>

        {canResend ? (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendLoading ? "Sending..." : "Send me a new verification link"}
            </button>
            {resendMessage ? (
              <p className="text-sm text-green-700">{resendMessage}</p>
            ) : null}
            {resendError ? (
              <p className="text-sm text-red-700">{resendError}</p>
            ) : null}
          </div>
        ) : null}

        {details.extra ? (
          <p className="mt-2 text-sm text-slate-600">{details.extra}</p>
        ) : null}

        {canTrack ? (
          <div className="mt-6">
            <Link
              href={trackingUrl!}
              className="inline-block rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Track your order
            </Link>
          </div>
        ) : null}

        {/* <div className="mt-8">
          <Link
            href="/customorders"
            className="text-sm font-medium text-slate-900 underline"
          >
            Back to custom order form
          </Link>
        </div> */}
      </div>
    </main>
  );
}
