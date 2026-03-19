import { uploadToCloudinaryDirect } from "@/server/config/cloudinary";
import { useMutation } from "@tanstack/react-query";

export const useUploadFileMutation = () => {
  return useMutation({
    mutationFn: (file: File) => uploadToCloudinaryDirect(file),
  });
};
