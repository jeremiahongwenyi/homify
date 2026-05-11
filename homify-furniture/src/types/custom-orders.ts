export interface CustomOrder {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  category: string;
  budgetMin?: number | null;
  budgetMax: number | null;
  dimensions?: string;
  materialPreference: string;
  colorPreference: string;
  accessToken?: string;
  tokenExpiresAt?: Date;
}

export type CustomOrderStatus =
  | "SUBMITTED"
  | "PENDING"
  | "UNDER_REVIEW"
  | "QUOTED"
  | "NEGOTIATION"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "CONVERTED_TO_ORDER";

export interface Quote {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  notes?: string;
  deliveryInfo?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  orderId: string;
  sender: "USER" | "ADMIN";
  content: string;
  createdAt: string;
}

export const STATUS_LABELS: Record<CustomOrderStatus, string> = {
  SUBMITTED: "Submitted",
   PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  QUOTED: "Quote Ready",
  NEGOTIATION: "In Negotiation",
  APPROVED: "Approved",
  REJECTED: "Declined",
  EXPIRED: "Expired",
  CONVERTED_TO_ORDER: "Order Created",
};

export const STATUS_COLORS: Record<CustomOrderStatus, string> = {
  SUBMITTED: "bg-warning/10 text-warning",
  PENDING: "bg-warning/10 text-warning",
  UNDER_REVIEW: "bg-warning/10 text-warning",
  QUOTED: "bg-primary/10 text-primary",
  NEGOTIATION: "bg-accent/10 text-accent",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-destructive/10 text-destructive",
  EXPIRED: "bg-muted text-muted-foreground",
  CONVERTED_TO_ORDER: "bg-success/10 text-success",
};

export interface imageUploadResponse {
  imageUrl: string;
  publicId: string;
}

export interface OrderDetails {
  id: string;
  customerName?: string | null;
  customerEmail: string;
  customerPhone?: string | null;
  description?: string | null;
  category?: string | null;
  budgetMax?: number | null;
  budgetMin?: number | null;
  dimensions?: string | null;
  materialPreference?: string | null;
  colorPreference?: string | null;

  status: CustomOrderStatus;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;

  createdAt: string;
  updatedAt: string;

  quotes: Quote[];
  images: Image[];
  conversations: Message[];
}

interface Image {
  id:string,
  imageUrl:string
}
