"use client";

import React, { useState, useRef } from "react";
import { MoveLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import DashboardPageHeaderTitle from "../DashboardPageHeaderTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormData {
  gender: string;
  ageRange: string;
  childName: string;
  uploadedImages: string[];
  imageStyle: string;
  language: string;
  storyIdea: string;
  price: string;
  offerPercentage: string;
}

interface ImageFile {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

const IMAGE_STYLES = ["Cartoon", "Illustration", "Colorful", "Simple"] as const;
const LANGUAGES = [
  "English",
  "Arabic",
  "French",
  "Spanish",
  "Italian",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_IMAGES = 3; // Maximum 3 images allowed

const Step2 = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

  const [formData, setFormData] = useState<FormData>({
    gender: "",
    ageRange: "",
    childName: "",
    uploadedImages: [],
    imageStyle: "",
    language: "",
    storyIdea: "",
    price: "",
    offerPercentage: "",
  });

  const gradientInitial =
    "linear-gradient(103deg, #8880F2 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImages = imageFiles.length;
    const newImagesCount = files.length;

    if (currentImages + newImagesCount > MAX_IMAGES) {
      alert(
        `You can only upload up to ${MAX_IMAGES} images. You already have ${currentImages} image${
          currentImages !== 1 ? "s" : ""
        }.`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const newImages: ImageFile[] = [];
    const errors: string[] = [];

    // Process files one by one
    const processNextFile = (index: number) => {
      if (index >= files.length) {
        // All files processed
        if (newImages.length > 0) {
          const updatedImages = [...imageFiles, ...newImages];
          setImageFiles(updatedImages);
          setFormData((prev) => ({
            ...prev,
            uploadedImages: [
              ...prev.uploadedImages,
              ...newImages.map((img) => img.url),
            ],
          }));
        }

        if (errors.length > 0) {
          setTimeout(() => {
            alert(`Some files were not uploaded:\n${errors.join("\n")}`);
          }, 100);
        }

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const file = files[index];

      // Check file type
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Please upload only JPG or PNG files`);
        processNextFile(index + 1);
        return;
      }

      // Check file size (5MB limit)
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size should be less than 5MB`);
        processNextFile(index + 1);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageFile: ImageFile = {
          id: `${Date.now()}-${index}`,
          url: reader.result as string,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        newImages.push(imageFile);
        processNextFile(index + 1);
      };
      reader.onerror = () => {
        errors.push(`${file.name}: Error reading file`);
        processNextFile(index + 1);
      };
      reader.readAsDataURL(file);
    };

    // Start processing files
    processNextFile(0);
  };

  const removeImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newImageUrls = formData.uploadedImages.filter((_, i) => i !== index);

    setImageFiles(newImageFiles);
    setFormData((prev) => ({
      ...prev,
      uploadedImages: newImageUrls,
    }));
  };

  const removeAllImages = () => {
    setImageFiles([]);
    setFormData((prev) => ({ ...prev, uploadedImages: [] }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    console.log("Image files:", imageFiles);
  };

  // Prevent number input scroll
  const preventScrollChange = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  };

  const {
    gender,
    ageRange,
    childName,
    imageStyle,
    language,
    storyIdea,
    price,
    offerPercentage,
  } = formData;

  const router = useRouter();

  return (
    <div className="space-y-4">
      <DashboardPageHeaderTitle title="Add New Books" />

      <div className="bg-white  p-4 sm:p-6 md:p-8 rounded-[20px]">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Gender Selection */}
          <div className="flex flex-col items-center gap-2 self-stretch p-4 sm:p-6 md:p-8 rounded-[20px] border border-[#F28097] bg-white/50 shadow-[0_0_20px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
            <h2 className="text-center text-base sm:text-lg font-bold text-gray-800">
              Select the character for your story!
            </h2>
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              {["male", "female"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInputChange("gender", option)}
                  className={`py-3 rounded-xl border font-medium transition-colors capitalize text-sm sm:text-base ${
                    gender === option
                      ? "border-[#F28097] bg-[rgba(242,128,151,0.10)] shadow-[0_0_6px_0_rgba(86,86,86,0.20)] text-[#F28097]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Child Details */}
          <div className="flex flex-col items-center gap-2 self-stretch  p-4 sm:p-6 md:p-8 rounded-[20px] border border-[#F28097] bg-white/50 shadow-[0_0_20px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
            <h2 className="text-center text-base sm:text-lg font-bold text-gray-800">
              Select details of your child for the story book!
            </h2>
            <div className="space-y-4 w-full mt-4">
              <div>
                <label
                  htmlFor="ageRange"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Child&apos;s Age Range
                </label>
                <input
                  id="ageRange"
                  type="text"
                  value={ageRange}
                  onChange={(e) =>
                    handleInputChange("ageRange", e.target.value)
                  }
                  placeholder="4-6 Years"
                  className="w-full px-4 py-3 rounded-xl border border-[#636F85] bg-white shadow-[0_0_6px_0_rgba(86,86,86,0.20)] focus:outline-none focus:border-[#F28097] focus:ring-1 focus:ring-[#F28097] text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="childName"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Child&apos;s Name
                </label>
                <input
                  id="childName"
                  type="text"
                  value={childName}
                  onChange={(e) =>
                    handleInputChange("childName", e.target.value)
                  }
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-xl border border-[#636F85] bg-white shadow-[0_0_6px_0_rgba(86,86,86,0.20)] focus:outline-none focus:border-[#F28097] focus:ring-1 focus:ring-[#F28097] text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="flex flex-col items-center gap-2 self-stretch  p-4 sm:p-6 md:p-8 rounded-[20px] border border-[#F28097] bg-white/50 shadow-[0_0_20px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
            <h2 className="text-center text-base sm:text-lg font-bold text-gray-800">
              Upload your child&apos;s photos here!
            </h2>

            {/* Static 6 images - 3 positive and 3 negative */}
            <div className="flex flex-col justify-center items-center gap-2 sm:gap-3 w-full mt-4">
              {/* Top row - 3 positive images */}
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <Image
                    key={`positive-${i}`}
                    src={"/images/dashboard/posative-image.svg"}
                    alt="positive example"
                    width={70}
                    height={70}
                    className="rounded-lg"
                  />
                ))}
              </div>

              {/* Bottom row - 3 negative images */}
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <Image
                    key={`negative-${i}`}
                    src={"/images/dashboard/negative-image.svg"}
                    alt="negative example"
                    width={70}
                    height={70}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-2">
              Upload up to 3 clear photos of your child for best results
            </p>

            {/* Multiple image Upload Button */}
            <div className="flex flex-col items-center w-full mt-4">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={imageFiles.length >= MAX_IMAGES}
                className={`relative px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 group/login overflow-hidden border border-white w-full sm:w-auto order-1 sm:order-2 mt-2 ${
                  imageFiles.length >= MAX_IMAGES ? " cursor-not-allowed" : ""
                }`}>
                <div className="inline-flex items-center justify-center gap-2 sm:gap-3 relative z-10 w-full">
                  <Upload size={18} className="text-white" />
                  <span className="text-white">
                    {imageFiles.length >= MAX_IMAGES
                      ? "Maximum 3 images uploaded"
                      : "Upload Image"}
                  </span>
                </div>
                <>
                  <span
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{ background: gradientHover }}
                  />
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                    style={{ background: gradientInitial }}
                  />
                </>
              </button>
              <span className="text-xs text-gray-400 mt-2">
                PNG, JPG up to 5MB
              </span>
              {imageFiles.length > 0 && (
                <span className="text-xs text-gray-600 mt-1">
                  {imageFiles.length} of {MAX_IMAGES} images uploaded
                </span>
              )}
            </div>

            {/* Show uploaded images count */}
            {imageFiles.length > 0 && (
              <div className="mt-4">
                <div className="text-center text-sm text-green-500 font-medium">
                  {imageFiles.length} image{imageFiles.length !== 1 ? "s" : ""}{" "}
                  uploaded!
                </div>
                <button
                  type="button"
                  onClick={removeAllImages}
                  className="mt-1 text-center w-full text-sm text-red-500 hover:text-red-700 font-medium">
                  Remove all images
                </button>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              multiple
              className="hidden"
            />
          </div>

          {/* Uploaded Photos Preview Section - All images together */}
          {imageFiles.length > 0 && (
            <div className="flex flex-col items-center gap-2 self-stretch  p-4 sm:p-6 md:p-8 rounded-[20px] border border-[#F28097] bg-white/50 shadow-[0_0_20px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
              <h2 className="text-center text-base sm:text-lg font-bold text-gray-800">
                Uploaded photos of your child
              </h2>

              {/* Display all uploaded images in a grid */}
              <div className="flex justify-center gap-4 flex-wrap mt-4">
                {imageFiles.map((image, index) => (
                  <div key={image.id} className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <div className="w-28 h-28 rounded-full border-4 border-green-400 overflow-hidden">
                        <Image
                          width={112}
                          height={112}
                          unoptimized
                          src={image.url}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center max-w-[100px] truncate">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>

              {/* <p className="text-center text-sm text-green-500 font-medium mt-4">
            All {imageFiles.length} image{imageFiles.length !== 1 ? "s" : ""}{" "}
            look perfect!
          </p> */}
              <p className="text-center text-xs text-gray-500 mt-2.5">
                Click on the X button to remove individual images
              </p>
            </div>
          )}

          {/* Image Style Selection */}
          <div className="flex flex-col items-center gap-2 self-stretch  p-4 sm:p-6 md:p-8 rounded-[20px] border border-[#F28097] bg-white/50 shadow-[0_0_20px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
            <h2 className="text-center text-base sm:text-lg font-bold text-gray-800">
              Select the image style for the story you&apos;re creating!
            </h2>
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              {IMAGE_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleInputChange("imageStyle", style)}
                  className={`py-2 px-3 sm:px-4 rounded-xl border font-medium text-sm transition-colors ${
                    imageStyle === style
                      ? "border-[#F28097] bg-[rgba(242,128,151,0.10)] shadow-[0_0_6px_0_rgba(86,86,86,0.20)] text-[#F28097]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}>
                  {style}
                </button>
              ))}
            </div>
            <div className="w-full mt-4 rounded-lg overflow-hidden">
              <div className="w-full h-36 sm:h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm sm:text-base">
                  Style Preview
                </div>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex flex-col items-center gap-2 self-stretch  p-4 sm:p-6 md:p-8 rounded-[20px] border border-[#F28097] bg-white/50 shadow-[0_0_20px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
            <h2 className="text-center text-base sm:text-lg font-bold text-gray-800">
              Select the language for the story!
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-4">
              {LANGUAGES.slice(0, 3).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleInputChange("language", lang)}
                  className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                    language === lang
                      ? "border-[#F28097] bg-[rgba(242,128,151,0.10)] shadow-[0_0_6px_0_rgba(86,86,86,0.20)] text-[#F28097]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}>
                  {lang}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 w-full mt-3">
              {LANGUAGES.slice(3).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleInputChange("language", lang)}
                  className={`py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                    language === lang
                      ? "border-[#F28097] bg-[rgba(242,128,151,0.10)] shadow-[0_0_6px_0_rgba(86,86,86,0.20)] text-[#F28097]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Story Idea */}
          <div className="flex flex-col items-center gap-2 self-stretch  p-4 sm:p-6 md:p-8 rounded-[20px] border border-[#F28097] bg-white/50 shadow-[0_0_20px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
            <h2 className="text-center text-base sm:text-lg font-bold text-gray-800">
              Share your story idea, dream or adventure, and we&apos;ll take
              care of the rest
            </h2>
            <div className="w-full mt-4">
              <label
                htmlFor="storyIdea"
                className="block text-sm font-medium text-gray-700 mb-2">
                Write your story idea
              </label>
              <textarea
                id="storyIdea"
                value={storyIdea}
                onChange={(e) => handleInputChange("storyIdea", e.target.value)}
                placeholder="Prompt..."
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-xl border border-[#636F85] bg-white shadow-[0_0_6px_0_rgba(86,86,86,0.20)] focus:outline-none focus:border-[#F28097] focus:ring-1 focus:ring-[#F28097] resize-none text-sm sm:text-base"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {storyIdea.length}/1000 characters
              </div>
            </div>
          </div>

          {/* Price Settings */}
          <div className="flex flex-col items-center gap-2 self-stretch  p-4 sm:p-6 md:p-8 rounded-[20px] border border-[#F28097] bg-white/50 shadow-[0_0_20px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
            <h2 className="text-center text-base sm:text-lg font-bold text-gray-800">
              Set the price of the book
            </h2>
            <div className="space-y-4 w-full mt-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Price in Euro
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  onWheel={preventScrollChange}
                  placeholder="€ 00.00"
                  className="w-full px-4 py-3 rounded-xl border border-[#636F85] bg-white shadow-[0_0_6px_0_rgba(86,86,86,0.20)] focus:outline-none focus:border-[#F28097] focus:ring-1 focus:ring-[#F28097] text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="offerPercentage"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Please provide the offer percentage (If any)
                </label>
                <input
                  id="offerPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={offerPercentage}
                  onChange={(e) =>
                    handleInputChange("offerPercentage", e.target.value)
                  }
                  onWheel={preventScrollChange}
                  placeholder="%"
                  className="w-full px-4 py-3 rounded-xl border border-[#636F85] bg-white shadow-[0_0_6px_0_rgba(86,86,86,0.20)] focus:outline-none focus:border-[#F28097] focus:ring-1 focus:ring-[#F28097] text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 border border-[#F28097] text-[#F28097] rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-pink-50 transition-colors w-full sm:w-auto order-2 sm:order-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                <MoveLeft className="w-full h-full" />
              </div>
              <span className="whitespace-nowrap">Back To Previews Page</span>
            </button>

            <Link
              href={"/dashboard/books/create/step-2"}
              className="relative px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 group/login overflow-hidden border border-white w-full sm:w-auto order-1 sm:order-2">
              <div className="inline-flex items-center justify-center gap-2 sm:gap-3 relative z-10 w-full">
                <span className="text-white">Create Books</span>
              </div>
              <span
                className="absolute inset-0 rounded-lg transition-all duration-300"
                style={{ background: gradientHover }}
              />
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                style={{ background: gradientInitial }}
              />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2;
