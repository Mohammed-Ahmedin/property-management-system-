/**
 * Upload a file via the internal Next.js API route which uses server-side
 * Cloudinary credentials. This avoids exposing API keys in the browser and
 * works regardless of which NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set.
 */
export const uploadToCloudinaryDirect = async (
  file: File
): Promise<{ secure_url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Upload failed");
  }

  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload failed");
  return data;
};
