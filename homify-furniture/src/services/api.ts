const API_BASE = "/api";
import { emailVerificationSchema } from "@/schemas/auth";
import type { CustomOrder } from "@/types/custom-orders";

export const api = {
  createCustomOrder: async (
    files: File[],
    order: CustomOrder,
    folder?: string,
  ) => {
    console.log("Images received", files);
    console.log("order received", order);

    try {
      const formData = new FormData();
      formData.append("order", JSON.stringify(order));
      formData.append("folder", folder || "custom-orders");
      files.forEach((file) => formData.append("files", file));

      const response = await fetch(`${API_BASE}/custom-order`, {
        method: "POST",
        body: formData,
      });

      const res = await response.json();

      if (!response.ok || !res.success) {
        throw new Error(res?.error?.message || "Failed to create custom order");
      }

      return res?.data?.message || "Order submitted successfully.";
    } catch (error: any) {
      console.log("error occured in createorder method", error);
      throw error;
    }
  },

  deleteImage: async (publicId: string) => {
    const response = await fetch(`${API_BASE}/upload`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    return response.json();
  },

  // Orders

  getOrder: async (token: string) => {
    const response = await fetch(
      `${API_BASE}/custom-order/get-order?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
      },
    );

    const res = await response.json();
    if (!response.ok || !res.success) {
      throw new Error(res?.error?.message || "Failed to fetch order");
    }

    const { order } = res.data;
    return order;
  },
  // getOrders: async (limit?: number) => {
  //   const url = limit
  //     ? `${API_BASE}/orders?limit=${limit}`
  //     : `${API_BASE}/orders`;
  //   const response = await fetch(url);
  //   return response.json();
  // },

  // deleteOrder: async (orderId: string) => {
  //   const response = await fetch(`${API_BASE}/orders`, {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ orderId }),
  //   });

  //   if (!response.ok) {
  //     throw new Error("Failed to delete order");
  //   }

  //   return response.json();
  // },

  // Products
  getProducts: async (category?: string) => {
    const url = category
      ? `${API_BASE}/products?category=${category}`
      : `${API_BASE}/products`;
    const response = await fetch(url);
    return response.json();
  },

  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE}/products?id=${id}`);
    return response.json();
  },

  saveProduct: async (productData: any) => {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to save product");
    }

    return response.json();
  },

  checkEmail: async (email: string) => {
    emailVerificationSchema.parse({ email });

    const response = await fetch(`${API_BASE}/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Email verification failed");
    }
    return response.json();
  },
};
