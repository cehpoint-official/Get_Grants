export const uploadToCloudinary = async (file: File): Promise<string> => {
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  if (!CLOUDINARY_URL || !CLOUDINARY_PRESET) {
    throw new Error("Cloudinary is not configured. Set VITE_CLOUDINARY_URL and VITE_CLOUDINARY_PRESET in your .env");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET); // from .env

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "Failed to upload image";
    try {
      const err = await response.json();
      message = err?.error?.message || message;
    } catch {}
    throw new Error(message);
  }

  const data = await response.json();
  return data.secure_url;
};
