import { getEnvironmentConfig } from "@utils/environment";
import { getUrl, remove, uploadData } from "aws-amplify/storage";

export type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

export type UploadResult = {
  key: string;
  url: string;
};

export const uploadFile = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> => {
  try {
    const envConfig = getEnvironmentConfig();

    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const key = `posts/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Check if we're in demo mode
    const isDemoMode = envConfig.demoMode;

    if (isDemoMode) {
      // Demo mode: Create a local object URL
      const url = URL.createObjectURL(file);

      // Simulate upload progress
      if (onProgress) {
        const totalBytes = file.size;
        let loadedBytes = 0;
        const interval = setInterval(() => {
          loadedBytes += Math.random() * (totalBytes / 10);
          if (loadedBytes >= totalBytes) {
            loadedBytes = totalBytes;
            clearInterval(interval);
          }
          onProgress({
            loaded: loadedBytes,
            total: totalBytes,
            percentage: Math.round((loadedBytes / totalBytes) * 100),
          });
        }, 100);
      }

      return {
        key: `demo-${key}`,
        url: url,
      };
    }

    // Production mode: Upload to S3
    await uploadData({
      key,
      data: file,
      options: {
        onProgress: ({
          transferredBytes,
          totalBytes,
        }: {
          transferredBytes: number;
          totalBytes: number;
        }) => {
          if (onProgress && totalBytes) {
            onProgress({
              loaded: transferredBytes,
              total: totalBytes,
              percentage: Math.round((transferredBytes / totalBytes) * 100),
            });
          }
        },
      },
    });

    // Get the public URL for the uploaded file
    const urlResult = await getUrl({
      key,
      options: {
        expiresIn: 3600, // 1 hour
      },
    });

    return {
      key,
      url: urlResult.url.toString(),
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Upload failed");
  }
};

export const deleteFile = async (key: string): Promise<void> => {
  try {
    const envConfig = getEnvironmentConfig();
    const isDemoMode = envConfig.demoMode;

    if (isDemoMode) {
      // Demo mode: Revoke object URL if it's a demo key
      if (key.startsWith("demo-")) {
        // In demo mode, we can't actually delete the object URL
        // but we can log it for debugging
        return;
      }
    }

    // Production mode: Delete from S3
    await remove({ key });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Delete failed");
  }
};

export const getFileUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  try {
    const envConfig = getEnvironmentConfig();
    const isDemoMode = envConfig.demoMode;

    if (isDemoMode) {
      // Demo mode: Return the key as-is if it's already a URL
      if (key.startsWith("blob:") || key.startsWith("http")) {
        return key;
      }
      // Otherwise, return a placeholder
      return `https://via.placeholder.com/400x300/4f46e5/ffffff?text=Demo+Image`;
    }

    // Production mode: Get signed URL from S3
    const urlResult = await getUrl({
      key,
      options: {
        expiresIn,
      },
    });

    return urlResult.url.toString();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Get URL failed");
  }
};
