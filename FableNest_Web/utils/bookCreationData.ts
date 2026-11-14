// Utility to store and retrieve book creation data across pages

export interface BookCreationData {
  gender: "Boy" | "Girl" | null;
  childName: string;
  childAge: string;
  photos: Array<{ id: string; status: "accepted" | "rejected" }>; // Don't store URLs to save space
  imageStyle: string | null;
  language: string | null;
  storyIdea: string;
  // Generated data
  generatedStory?: {
    story: { [key: string]: string };
    prompt: { [key: string]: string };
    page_connections: { [key: string]: string };
  };
  previewImages?: {
    "page 0": string;
    "page 1": string;
  };
  fullBookImages?: { [key: string]: string };
  page1Url?: string;
  bookId?: string; // Book ID from API response
  // API response data
  bookTitle?: string; // From API response title
  apiCharacterName?: string; // From API response characterName
  apiCharacterAge?: number; // From API response characterAge
  totalPage?: number; // From API response totalPage (may not be present initially)
  firstPageFullUrl?: string; // From API response firstPage.fullPageUrl
}

const STORAGE_KEY = "bookCreationData";
const REFERENCE_IMAGE_KEY = "referenceImageFile";

export const saveBookCreationData = (data: Partial<BookCreationData>) => {
  if (typeof window === "undefined") return;
  
  try {
    const existing = getBookCreationData();
    const updated = { ...existing, ...data };
    
    // Store photos without URLs to save space
    const dataToStore = {
      ...updated,
      photos: updated.photos?.map(p => ({
        id: p.id,
        status: p.status,
        // Don't store URL - it's stored separately as reference image
      })),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    // If quota exceeded, try to clear old data
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.warn("LocalStorage quota exceeded. Clearing old data...");
      // Clear old reference images
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith("referenceImage_")) {
          localStorage.removeItem(key);
        }
      });
      // Try again
      try {
        const existing = getBookCreationData();
        const updated = { ...existing, ...data };
        const dataToStore = {
          ...updated,
          photos: updated.photos?.map(p => ({
            id: p.id,
            status: p.status,
          })),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (retryError) {
        console.error("Failed to save after clearing:", retryError);
        throw retryError;
      }
    } else {
      throw error;
    }
  }
};

export const getBookCreationData = (): BookCreationData => {
  if (typeof window === "undefined") {
    return {
      gender: null,
      childName: "",
      childAge: "",
      photos: [],
      imageStyle: null,
      language: null,
      storyIdea: "",
    };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      gender: null,
      childName: "",
      childAge: "",
      photos: [],
      imageStyle: null,
      language: null,
      storyIdea: "",
    };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return {
      gender: null,
      childName: "",
      childAge: "",
      photos: [],
      imageStyle: null,
      language: null,
      storyIdea: "",
    };
  }
};

export const getReferenceImageFile = async (): Promise<File | null> => {
  if (typeof window === "undefined") return null;
  
  // Get reference image from the main key
  const dataUrl = localStorage.getItem(REFERENCE_IMAGE_KEY);
  
  if (!dataUrl) return null;
  
  try {
    // Convert data URL to File
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], "reference-image.jpg", { type: blob.type || "image/jpeg" });
  } catch (error) {
    console.error("Error converting reference image to File:", error);
    return null;
  }
};

// Get all accepted image files (max 3) for book creation API
export const getAcceptedImageFiles = async (): Promise<File[]> => {
  if (typeof window === "undefined") return [];
  
  const bookData = getBookCreationData();
  const acceptedPhotos = bookData.photos?.filter(p => p.status === "accepted") || [];
  
  if (acceptedPhotos.length === 0) return [];
  
  const imageFiles: File[] = [];
  
  // Get reference image (first accepted)
  const referenceImage = await getReferenceImageFile();
  if (referenceImage) {
    imageFiles.push(referenceImage);
  }
  
  // Get additional accepted images (up to 3 total)
  for (const photo of acceptedPhotos.slice(1, 3)) {
    try {
      const imageKey = `acceptedImage_${photo.id}`;
      const dataUrl = localStorage.getItem(imageKey);
      
      if (dataUrl) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `image-${photo.id}.jpg`, { type: blob.type || "image/jpeg" });
        imageFiles.push(file);
      }
    } catch (error) {
      console.error(`Error getting accepted image ${photo.id}:`, error);
    }
  }
  
  return imageFiles.slice(0, 3); // Ensure max 3 images
};

export const clearBookCreationData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(REFERENCE_IMAGE_KEY);
  
  // Clear any old reference image keys
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith("referenceImage_")) {
      localStorage.removeItem(key);
    }
  });
};

// Map image style keys to API values
// API expects: 'ANIME' | 'CHILDRENS_MANGA' | 'PIXER_3D' | 'SEMI_REALISTIC_CARTOON'
export const mapImageStyleToAPI = (style: string | null): string => {
  const styleMap: Record<string, string> = {
    "childrensManga": "CHILDRENS_MANGA",
    "pixar3D": "PIXER_3D",
    "semiRealisticCartoon": "SEMI_REALISTIC_CARTOON",
    "anime": "ANIME",
  };
  return styleMap[style || ""] || "CHILDRENS_MANGA";
};

// Map language keys to API values
export const mapLanguageToAPI = (language: string | null): string => {
  const langMap: Record<string, string> = {
    "english": "english",
    "arabic": "arabic",
    "french": "french",
    "spanish": "spanish",
    "italian": "italian",
  };
  return langMap[language || ""] || "english";
};

// Map gender to API format
export const mapGenderToAPI = (gender: "Boy" | "Girl" | null): string => {
  return gender === "Boy" ? "male" : gender === "Girl" ? "female" : "male";
};

