const API_BASE = "/api";
import { emailVerificationSchema } from "@/schemas/auth";

export const api = {
  // Upload to Cloudinary
  uploadImage: async (
    file: File,
    folder?: string,
  ): Promise<{ url: string; publicId: string; success: boolean }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data;
  },

  uploadMultipleImages: async (files: File[], folder?: string) => {
    const uploadPromises = files.map((file) => api.uploadImage(file, folder));
    return Promise.all(uploadPromises);
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
  getOrders: async (limit?: number) => {
    const url = limit
      ? `${API_BASE}/orders?limit=${limit}`
      : `${API_BASE}/orders`;
    const response = await fetch(url);
    return response.json();
  },

  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return response.json();
  },

  deleteOrder: async (orderId: string) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete order");
    }

    return response.json();
  },

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
