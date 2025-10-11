export const uploadToCloudinary = async (file: File): Promise<string> => {
  console.log("Cloudinary upload started...");
  console.log("File:", file.name, file.size, file.type);
  
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  console.log("Cloudinary URL:", CLOUDINARY_URL);
  console.log("Cloudinary Preset:", CLOUDINARY_PRESET);

  if (!CLOUDINARY_URL || !CLOUDINARY_PRESET) {
    const error = "Cloudinary is not configured. Set VITE_CLOUDINARY_URL and VITE_CLOUDINARY_PRESET in your .env";
    console.error(error);
    throw new Error(error);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET); 

  console.log("Sending request to Cloudinary...");
  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  console.log("Cloudinary response status:", response.status);
  console.log("Cloudinary response ok:", response.ok);

  if (!response.ok) {
    let message = "Failed to upload image";
    try {
      const err = await response.json();
      console.error("Cloudinary error response:", err);
      message = err?.error?.message || message;
    } catch (parseError) {
      console.error("Failed to parse error response:", parseError);
    }
    throw new Error(message);
  }

  const data = await response.json();
  console.log("Cloudinary upload successful:", data.secure_url);
  return data.secure_url;
};
