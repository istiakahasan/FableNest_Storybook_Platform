"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Check } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getBookCreationData, saveBookCreationData } from "@/utils/bookCreationData";

interface UploadedPhoto {
  id: string;
  url: string;
  status: "accepted" | "rejected";
}

export default function PhotoUploadPage() {
  const t = useTranslations("PhotoUpload");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  
  // Load existing photos from localStorage on mount (for display only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = getBookCreationData();
      if (data.photos && data.photos.length > 0) {
        // Photos in localStorage don't have URLs, so we'll just show count
        // URLs will be generated when files are uploaded again
        // For now, we'll keep the state empty and let user re-upload if needed
      }
    }
  }, []);

  const gradientInitial = "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover = "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #8880F2)";

  const handleBack = () => {
    // Save current photos before going back
    saveBookCreationData({ photos: uploadedPhotos });
    router.push("/create-own-book/child-details");
  };

  const handleNext = () => {
    // Validate: must have at least one accepted photo
    const acceptedPhotos = uploadedPhotos.filter(p => p.status === "accepted");
    if (acceptedPhotos.length === 0) {
      toast.error("Please upload at least one accepted photo");
      return;
    }
    
    // Clear the session flag when moving to next step
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("referenceImageStored");
    }
    // Photos are already saved in handleFileChange
    saveBookCreationData({ photos: uploadedPhotos });
    router.push("/create-own-book/image-style");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Limit to max 3 files
      const filesToProcess = Array.from(files).slice(0, 3);
      
      filesToProcess.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const url = event.target?.result as string;
          // All uploaded images are accepted by default
          // You can add validation logic here if needed (e.g., check file size, dimensions, etc.)
          const status: "accepted" | "rejected" = "accepted";
          const photo: UploadedPhoto = { 
            id: Date.now().toString() + Math.random() + index, 
            url, // Keep URL for display only
            status,
          };
          setUploadedPhotos((prev) => [...prev, photo]);
          
          // Save to localStorage
          if (typeof window !== "undefined") {
            const existing = getBookCreationData();
            const acceptedPhotos = existing.photos?.filter(p => p.status === "accepted") || [];
            
            // Check if we already have a reference image stored in localStorage
            const hasExistingReference = localStorage.getItem("referenceImageFile") !== null;
            
            // Store accepted photos (max 3) - first one as reference, others as additional images
            if (status === "accepted") {
              // Store the FIRST accepted photo as reference image
              if (!hasExistingReference) {
                const storedFlag = sessionStorage.getItem("referenceImageStored");
                if (!storedFlag) {
                  sessionStorage.setItem("referenceImageStored", "true");
                  try {
                    const compressedDataUrl = await compressImage(file, 0.7);
                    localStorage.setItem("referenceImageFile", compressedDataUrl);
                    console.log("✅ Reference image stored successfully (compressed)");
                  } catch (error) {
                    console.error("❌ Error compressing image:", error);
                    try {
                      localStorage.setItem("referenceImageFile", url);
                      console.log("✅ Reference image stored without compression");
                    } catch (storageError) {
                      console.error("❌ Failed to store reference image:", storageError);
                      toast.error("Failed to save reference image. Please try again.");
                    }
                  }
                }
              }
              
              // Store additional accepted photos (up to 3 total) as base64 in localStorage
              if (acceptedPhotos.length < 3) {
                try {
                  const compressedDataUrl = await compressImage(file, 0.7);
                  const imageKey = `acceptedImage_${photo.id}`;
                  localStorage.setItem(imageKey, compressedDataUrl);
                  console.log(`✅ Accepted image ${acceptedPhotos.length + 1} stored`);
                } catch (error) {
                  console.error("❌ Error storing accepted image:", error);
                }
              }
            }
            
            // Store photos metadata
            const updatedPhotos = [...(existing.photos || []), { 
              id: photo.id, 
              status: photo.status,
            }];
            
            saveBookCreationData({ 
              photos: updatedPhotos
            });
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Show warning if more than 3 files selected
      if (files.length > 3) {
        toast.warning("Maximum 3 images allowed. Only the first 3 will be processed.");
      }
    }
  };

  // Handle remove photo
  const handleRemovePhoto = (photoId: string) => {
    // Remove from state
    setUploadedPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== photoId);
      
      // Update localStorage
      if (typeof window !== "undefined") {
        const existing = getBookCreationData();
        const updatedPhotos = (existing.photos || []).filter((p) => p.id !== photoId);
        
        // Remove image data from localStorage
        const photoToRemove = prev.find((p) => p.id === photoId);
        if (photoToRemove?.status === "accepted") {
          // Remove accepted image from localStorage
          const imageKey = `acceptedImage_${photoId}`;
          localStorage.removeItem(imageKey);
          
          // If this was the reference image, clear it
          const existingReference = localStorage.getItem("referenceImageFile");
          if (existingReference) {
            // Check if this was the first accepted photo (reference image)
            const acceptedPhotos = prev.filter((p) => p.status === "accepted");
            const firstAccepted = acceptedPhotos[0];
            if (firstAccepted && firstAccepted.id === photoId) {
              localStorage.removeItem("referenceImageFile");
              sessionStorage.removeItem("referenceImageStored");
              
              // If there are other accepted photos, make the next one the reference
              const remainingAccepted = updated.filter((p) => p.status === "accepted");
              if (remainingAccepted.length > 0) {
                // The next accepted photo will become reference when they upload again
                // For now, just clear the old reference
              }
            }
          }
        }
        
        // Update photos metadata
        saveBookCreationData({ photos: updatedPhotos });
      }
      
      return updated;
    });
    
    toast.success("Photo removed successfully");
  };

  // Helper function to compress image
  const compressImage = (file: File, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Use document.createElement to avoid conflict with Next.js Image component
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1024; // Max width to reduce size
          const MAX_HEIGHT = 1024; // Max height to reduce size
          
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const rejectedPhotos = uploadedPhotos.filter((photo) => photo.status === "rejected");
  const acceptedPhotos = uploadedPhotos.filter((photo) => photo.status === "accepted");

  return (
    <div className="relative w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 my-[100px] sm:my-[200px]">
      {/* Background with gradient and particles */}
      <div
        className="absolute inset-0"
      >
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        {/* Main Content Card */}
        <div className="bg-[#FFFFFF80] backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-[#F28097] shadow-2xl">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-jost font-bold text-[#2D2D2D] text-center mb-8 sm:mb-10">
            {t("uploadChildPhoto")}
          </h1>

          {/* Photo Grid Container */}
          <div className="mb-10">
            {/* Rejected Photos Row */}
            {rejectedPhotos.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-center gap-6">
                  {rejectedPhotos.slice(0, 3).map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[3px] border-red-400 bg-gray-100">
                        <Image
                          src={photo.url}
                          alt="Rejected photo"
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                      {/* Rejected Badge */}
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <X className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg border border-white"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3 text-white" strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accepted Photos Row */}
            {acceptedPhotos.length > 0 && (
              <div>
                <div className="flex justify-center gap-6">
                  {acceptedPhotos.slice(0, 3).map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[3px] border-green-400 bg-gray-100">
                        <Image
                          src={photo.url}
                          alt="Accepted photo"
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                      {/* Accepted Badge */}
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#10B981] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg border border-white z-10"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3 text-white" strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upload Instructions */}
          <p className="text-lg text-[#2D2D2D] text-center mb-6 font-comme">
            {t("uploadPhoto")}
          </p>

          {/* Upload Button */}
          <div className="flex justify-center mb-3">
            <button
              onClick={handleUploadClick}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-bold text-base transition-all duration-300 overflow-hidden flex items-center gap-2.5 font-dynapuff"
            >
              <div className="flex items-center gap-2.5 relative z-10 pointer-events-none">
                <Upload className="w-5 h-5" />
                <span>{t("uploadImage")}</span>
              </div>
              <span
                className="absolute inset-0 rounded-xl transition-all duration-300"
                style={{ background: gradientInitial }}
              />
              <span
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: gradientHover }}
              />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              onChange={handleFileChange}
              className="hidden"
              // Note: HTML5 max attribute doesn't work for multiple files, handled in handleFileChange
            />
          </div>

          {/* File Type Info */}
          <p className="text-sm text-[#636F85] text-center font-comme">
            {t("pngJpgUpTo10MB")}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mt-8 sm:mt-10">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-[#F28097] bg-white text-[#F28097] font-semibold text-base hover:bg-[#FFF0F3] transition-all duration-300 flex items-center justify-center gap-2 font-dynapuff"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="#F28097" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{t("backToPreviousQuestion")}</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold text-base sm:text-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 font-dynapuff"
          >
            <div className="flex items-center justify-center gap-2 relative z-10 pointer-events-none">
              <span>{t("goToNextQuestion")}</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
            <span
              className="absolute inset-0 rounded-xl transition-all duration-300"
              style={{ background: gradientInitial }}
            />
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: gradientHover }}
            />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-25px) translateX(15px);
          }
        }
      `}</style>
    </div>
  );
}