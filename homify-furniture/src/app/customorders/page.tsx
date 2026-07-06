"use client";

import { useState } from "react";
import { UploadWithAPI } from "@/components/UploadWithAPI";
import { api } from "@/services/api";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CustomOrder } from "@/types/custom-orders";

interface UploadResult {
  url: string;
  publicId: string;
}

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    category: "sofa",
    budget: "",
    dimensions: "",
    materialPreference: "",
    colorPreference: "",
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetUpload, setResetUpload] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleFilesSelected = (files: File[] | UploadResult[]) => {
    // When autoUpload={false}, we receive File[]
    if (files.length > 0 && "slice" in files[0]) {
      setSelectedImages(files as File[]);
    }
    setError(null);
  };

  // Check if all required fields are filled
  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.description.trim() !== "" &&
      selectedImages.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    // if (
    //   !formData.name.trim() ||
    //   !formData.email.trim() ||
    //   !formData.phone.trim() ||
    //   !formData.description.trim()
    // ) {
    //   setError("Please fill in all required fields");
    //   return;
    // }

    if (selectedImages.length === 0) {
      setError("Please select at least one reference image");
      return;
    }

    setSubmitting(true);
    setUploadingImages(true);
    setError(null);

    // Step 1: Upload images to Cloudinary
    const customOrderData: CustomOrder = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      description: formData.description,
      category: formData.category,
      budgetMax: formData.budget ? parseInt(formData.budget) : null,
      // budgetMax: formData.budget ? parseInt(formData.budget) : null,
      dimensions: formData.dimensions,
      materialPreference: formData.materialPreference,
      colorPreference: formData.colorPreference,
    };

    try {
      const response = await api.createCustomOrder(
        selectedImages,
        customOrderData,
        "custom-orders",
      );

      toast.success(response);
      // setSuccess(true)
    } catch (error: any) {
      toast.error(error.message);
    }

    //   try {
    //     uploadedImages = await api.uploadMultipleImages(
    //       selectedImages,
    //       "custom-orders",
    //     );
    //     console.log("Images uploaded successfully:", uploadedImages);
    //   } catch (uploadError) {
    //     console.error("Image upload error:", uploadError);
    //     setUploadingImages(false);
    //     setSubmitting(false);
    //     throw new Error(
    //       uploadError instanceof Error
    //         ? `Failed to upload images: ${uploadError.message}`
    //         : "Failed to upload images to Cloudinary. Please check your file sizes and try again.",
    //     );
    //   }

    //   setUploadingImages(false);

    //   // Step 2: Save order data to database (automatically after successful upload)
    //   console.log("Saving order data to database...");
    //   try {
    //     const orderData = {
    //       customerName: formData.name,
    //       email: formData.email,
    //       phone: formData.phone,
    //       description: formData.description,
    //       category: formData.category,
    //       budget: formData.budget ? parseInt(formData.budget) : null,
    //       dimensions: formData.dimensions,
    //       materialPreference: formData.materialPreference,
    //       colorPreference: formData.colorPreference,
    //       images: uploadedImages.map((img) => ({
    //         url: img.url,
    //         publicId: img.publicId,
    //       })),
    //     };

    //     // Save to Firebase via API
    //     const result = await api.createOrder(orderData);
    //     console.log("Order saved successfully:", result);

    //     setSuccess(true);
    //     toast.success("Order created successfully!");

    //     // Reset form and images after delay
    //     setTimeout(() => {
    //       setFormData({
    //         name: "",
    //         email: "",
    //         phone: "",
    //         description: "",
    //         category: "sofa",
    //         budget: "",
    //         dimensions: "",
    //         materialPreference: "",
    //         colorPreference: "",
    //       });
    //       setSelectedImages([]);
    //       setResetUpload((prev) => !prev); // Toggle to trigger reset in UploadWithAPI
    //       setSuccess(false);
    //     }, 3000);
    //   } catch (dbError) {
    //     console.error("Database save error:", dbError);
    //     throw new Error(
    //       dbError instanceof Error
    //         ? `Failed to save order: ${dbError.message}`
    //         : "Failed to save your order to the database. Please try again.",
    //     );
    //   }
    // } catch (err) {
    //   console.error("Submission error:", err);
    //   setError(
    //     err instanceof Error
    //       ? err.message
    //       : "An unexpected error occurred. Please try again.",
    //   );
    // } finally {
    //   setSubmitting(false);
    //   setUploadingImages(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-display">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "inter, sans-serif" }}
          >
            Custom Furniture Orders
          </h1>
          <p className="text-lg text-gray-600">
            Can't find exactly what you're looking for? Let us create your
            perfect piece. Share your vision, and our craftsmen will bring it to
            life.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-600 shrink-0" />
              <div>
                <h3 className="font-bold text-green-800">
                  Order Submitted Successfully!
                </h3>
                <p className="text-green-700">
                  Your custom order has been received. We'll contact you within
                  24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-600 shrink-0" />
              <div>
                <h3 className="font-bold text-red-800">Submission Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "inter, sans-serif" }}
            >
              Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="+254 712 345 678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Furniture Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="sofa">Sofa</option>
                  <option value="bed">Bed</option>
                  <option value="dining-table">Dining Table</option>
                  <option value="chair">Chair</option>
                  <option value="cabinet">Cabinet</option>
                  <option value="shelf">Shelf</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "inter, sans-serif" }}
            >
              Project Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Describe your custom furniture piece in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (KSh)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (W x H x D)
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 200cm x 90cm x 85cm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Preference
                  </label>
                  <input
                    type="text"
                    name="materialPreference"
                    value={formData.materialPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Oak wood, Velvet"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Preference
                </label>
                <input
                  type="text"
                  name="colorPreference"
                  value={formData.colorPreference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Navy blue, Natural wood"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "inter, sans-serif" }}
            >
              Reference Images
            </h2>
            <p className="text-gray-600 mb-4">
              Select images of similar furniture pieces or sketches that inspire
              your design.
            </p>
            <p
              className="text-sm mb-6 flex items-center gap-2"
              style={{ color: "#235c47" }}
            >
              <span className="inline-block">ℹ️</span>
              Maximum 5 images, 10MB each
            </p>

            <UploadWithAPI
              onUploadComplete={handleFilesSelected}
              maxFiles={5}
              folder="custom-orders"
              maxSize={10}
              autoUpload={false}
              reset={resetUpload}
            />

            {selectedImages.length > 0 && (
              <div
                className="mt-6 p-4 rounded-lg border"
                style={{ backgroundColor: "#f0f6f4", borderColor: "#235c47" }}
              >
                <p className="text-sm font-medium" style={{ color: "#235c47" }}>
                  ✓ {selectedImages.length} image
                  {selectedImages.length !== 1 ? "s" : ""} selected (will be
                  uploaded on submit)
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <button
              type="submit"
              // disabled={!isFormValid() || submitting}
              className="w-full py-4 px-6 text-white font-bold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
              style={{ backgroundColor: "#235c47" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1a4533")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#235c47")
              }
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {uploadingImages
                    ? "Uploading Images..."
                    : "Processing Your Order..."}
                </>
              ) : (
                "Submit Custom Order Request"
              )}
            </button>
            <p className="text-sm text-muted-foreground text-center mt-3">
              By submitting this form, you agree to be contacted by our team
              regarding your custom furniture request.
            </p>
            {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#235c47" }}
                ></div>
                <span>Secure image upload</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Response within 24 hours</span>
              </div>
            </div> */}
          </div>
        </form>
      </div>
    </div>
  );
}
