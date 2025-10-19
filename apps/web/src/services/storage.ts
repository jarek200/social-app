import { uploadData, getUrl, remove } from 'aws-amplify/storage';

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
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const key = `posts/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Check if we're in demo mode
    const isDemoMode = import.meta.env.PUBLIC_DEMO_MODE === "true" || 
                       !import.meta.env.PUBLIC_S3_BUCKET;

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
    const result = await uploadData({
      key,
      data: file,
      options: {
        onProgress: ({ transferredBytes, totalBytes }: { transferredBytes: number; totalBytes: number }) => {
          if (onProgress && totalBytes) {
            onProgress({
              loaded: transferredBytes,
              total: totalBytes,
              percentage: Math.round((transferredBytes / totalBytes) * 100),
            });
          }
        },
      },
    }).result;

    // Get the public URL for the uploaded file
    const url = await getUrl({
      key: result.key,
      options: {
        expiresIn: 3600, // 1 hour
      },
    }).result;

    return {
      key: result.key,
      url: url.url.toString(),
    };
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error(error instanceof Error ? error.message : "Upload failed");
  }
};

export const deleteFile = async (key: string): Promise<void> => {
  try {
    // Check if we're in demo mode
    const isDemoMode = import.meta.env.PUBLIC_DEMO_MODE === "true" || 
                       !import.meta.env.PUBLIC_S3_BUCKET;

    if (isDemoMode) {
      // Demo mode: Revoke object URL if it's a demo key
      if (key.startsWith('demo-')) {
        // In demo mode, we can't actually delete the object URL
        // but we can log it for debugging
        console.log(`Demo mode: Would delete file ${key}`);
        return;
      }
    }

    // Production mode: Delete from S3
    await remove({ key });
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error(error instanceof Error ? error.message : "Delete failed");
  }
};

export const getFileUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  try {
    // Check if we're in demo mode
    const isDemoMode = import.meta.env.PUBLIC_DEMO_MODE === "true" || 
                       !import.meta.env.PUBLIC_S3_BUCKET;

    if (isDemoMode) {
      // Demo mode: Return the key as-is if it's already a URL
      if (key.startsWith('blob:') || key.startsWith('http')) {
        return key;
      }
      // Otherwise, return a placeholder
      return `https://via.placeholder.com/400x300/4f46e5/ffffff?text=Demo+Image`;
    }

    // Production mode: Get signed URL from S3
    const result = await getUrl({
      key,
      options: {
        expiresIn,
      },
    }).result;

    return result.url.toString();
  } catch (error) {
    console.error("Get URL failed:", error);
    throw new Error(error instanceof Error ? error.message : "Get URL failed");
  }
};
