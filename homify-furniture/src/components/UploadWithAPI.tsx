import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Loader2, Check, AlertCircle } from "lucide-react";
import { api } from "@/services/api";

interface UploadResult {
  url: string;
  publicId: string;
}

interface UploadWithAPIProps {
  onUploadComplete: (results: UploadResult[] | File[]) => void;
  maxFiles?: number;
  folder?: string;
  maxSize?: number; // in MB
  autoUpload?: boolean; // If false, just select files without uploading
  reset?: boolean; // Trigger to reset files and previews
}

export function UploadWithAPI({
  onUploadComplete,
  maxFiles = 5,
  folder = "",
  maxSize = 10,
  autoUpload = true,
  reset = false,
}: UploadWithAPIProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedResults, setUploadedResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset files and previews when reset prop changes
  useEffect(() => {
    if (reset) {
      setFiles([]);
      setPreviews([]);
      setUploadedResults([]);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [reset]);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }

    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  // Changed: Now accepts File[] directly, not an event
  const handleFilesSelected = useCallback(
    (selectedFiles: File[]) => {
      if (files.length + selectedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles: File[] = [];
      const newPreviews: string[] = [];
      let hasError = false;

      selectedFiles.forEach((file) => {
        const validationError = validateFile(file);

        if (validationError) {
          setError(validationError);
          hasError = true;
          return;
        }

        validFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      });

      if (hasError) return;

      setFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      setError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // If autoUpload is false, just pass the files to parent component
      if (!autoUpload) {
        onUploadComplete([...files, ...validFiles]);
      }
    },
    [files, maxFiles, maxSize, autoUpload, onUploadComplete],
  );

  // Changed: Wrapper for input onChange event
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      handleFilesSelected(selectedFiles);
    },
    [handleFilesSelected],
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = [...files];
      const newPreviews = [...previews];

      URL.revokeObjectURL(newPreviews[index]);

      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);

      setFiles(newFiles);
      setPreviews(newPreviews);

      // Update parent component with the new files list
      if (!autoUpload) {
        onUploadComplete(newFiles);
      }
    },
    [files, previews, autoUpload, onUploadComplete],
  );

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    console.log('just sending files to the parent');
    
    // try {
    //   // Upload files via API route
    //   const results = await api.uploadMultipleImages(files, folder);
    //   console.log("Upload results:", results);

    //   // Check if upload was successful
    //   if (results && results.length > 0) {
    //     setUploadedResults(results);
    //     onUploadComplete(results);
    //   } else {
    //     throw new Error("No results returned");
    //   }
    // } catch (err: any) {
    //   setError(err.message || "Upload failed. Please try again.");
    //   console.error("Upload error:", err);
    // } finally {
    //   setUploading(false);
    // }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = Array.from(e.dataTransfer.files);

      // Changed: Call handleFilesSelected directly with files
      handleFilesSelected(droppedFiles);
    },
    [handleFilesSelected],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Upload Images</h3>
          {/* <p className="text-sm text-gray-500">
            Images will be optimized and stored on Cloudinary
          </p> */}
        </div>

        {files.length > 0 && !uploading && autoUpload && (
          <button
            type="button"
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload {files.length} image{files.length !== 1 ? "s" : ""}
          </button>
        )}
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange} // Changed: Use new wrapper function
          multiple
          accept="image/*"
          className="hidden"
          disabled={uploading || files.length >= maxFiles}
        />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {uploading ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <div className="w-full max-w-xs mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Uploading to Cloudinary via API...
                </p>
              </div>
            </div>
          </div>
        ) : uploadedResults.length > 0 ? (
          <div className="text-center">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-700">Upload Successful!</p>
            <p className="text-sm text-gray-600">
              {uploadedResults.length} image
              {uploadedResults.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= maxFiles}
            className="flex flex-col items-center justify-center w-full space-y-3"
          >
            <div className="p-4 bg-blue-100 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Click to upload or drag & drop</p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, WebP (Max {maxSize}MB each)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Images will be automatically optimized
              </p>
            </div>
            {files.length > 0 && (
              <p className="text-sm">
                {files.length}/{maxFiles} files selected
              </p>
            )}
          </button>
        )}
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="mt-2 space-y-1">
                  <p className="text-xs truncate">{files[index].name}</p>
                  <p className="text-xs text-gray-500">
                    {(files[index].size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Results */}
      {/* {uploadedResults.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Uploaded Images:</h4>
          <div className="space-y-2">
            {uploadedResults.map((result, index) => (
              <div key={result.publicId} className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {result.url}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">
                    Public ID: {result.publicId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
