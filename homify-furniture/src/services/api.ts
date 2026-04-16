const API_BASE = "/api";
import { emailVerificationSchema } from "@/schemas/auth";
import type { CustomOrder, imageUploadResponse } from "@/types/custom-orders";

export const api = {
  createCustomOrder: async (
    files: File[],
    order: CustomOrder,
    folder?: string,
  ) => {
    console.log("Images received", files);
    console.log("order received", order);

    try {
      const resp = await createOrder(order);
      // const orderWithImages = { ...order, response };
      console.log("pick the order id from here", resp);
      const { id } = resp.data;

      const uploadPromises = files.map((file) => uploadImage(file, folder));
      const response: imageUploadResponse[] = await Promise.all(uploadPromises);
      console.log("uploaded responses", response);


      const saveImageResponse = await saveImage(id,response)

      return "Your order has been received successfully. We've sent you an email with more information and next steps.";
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
  getOrders: async (limit?: number) => {
    const url = limit
      ? `${API_BASE}/orders?limit=${limit}`
      : `${API_BASE}/orders`;
    const response = await fetch(url);
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

const uploadImage = async (file: File, folder?: string) => {
  console.log("Starting image upload to Cloudinary...");
  console.log("single file to upload", file, folder);

  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);

  console.log("formdata", formData);

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  const resp = await response.json();

  console.log("data from the upload", resp);

  if (!response.ok || !resp.success) {
    throw resp?.error;
  }

  const { url, publicId } = resp?.data;
  return { imageUrl: url, publicId };
};

const saveImage = async(id:string, images: imageUploadResponse[] )=>{
 try {
    const response = await fetch(`${API_BASE}/save-images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({customOrderId:id,images}),
    });

    const res = await response.json();

    console.log("response in saving", res);

    if (!response.ok || !res.success) {
      throw res?.error;
    }

    return res;
  } catch (error) {
    throw error;
  }


}

const createOrder = async (orderData: CustomOrder) => {
  console.log("am now in create order", orderData);

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const res = await response.json();

    console.log("response in creating", res);

    // 🔥  error handling
    if (!response.ok || !res.success) {
      throw res?.error;
    }

    return res;
  } catch (error) {
    console.log("eeei nomaaa", error);
    throw error;
  }
};
