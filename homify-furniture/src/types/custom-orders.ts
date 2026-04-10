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
}


export interface imageUploadResponse {
    imageUrl: string,
    publicId:string
}