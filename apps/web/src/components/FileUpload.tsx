import { useState, useRef } from "preact/hooks";
import { uploadFile, type UploadProgress } from "@services/storage";

type FileUploadProps = {
  onUploadComplete: (result: { key: string; url: string }) => void;
  onUploadError: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
};

export function FileUpload({
  onUploadComplete,
  onUploadError,
  accept = "image/*",
  maxSize = 10,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace("*", ".*"))) {
      onUploadError("Invalid file type");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

      const result = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      onUploadComplete(result);
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    if (target.files?.[0]) {
      handleFile(target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div class="w-full">
      <div
        class={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-colors ${
          dragActive ? "border-brand-400 bg-brand-500/10" : "border-white/40 bg-slate-950/40"
        } ${isUploading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-brand-400"}`}
        role="button"
        tabIndex={0}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileDialog();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          class="hidden"
          disabled={isUploading}
        />

        {isUploading && uploadProgress ? (
          <div class="w-full space-y-2">
            <div class="flex justify-between text-sm text-slate-300">
              <span>Uploading...</span>
              <span>{uploadProgress.percentage}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-slate-700">
              <div
                class="h-2 rounded-full bg-brand-500 transition-all duration-300"
                style={{ width: `${uploadProgress.percentage}%` }}
              />
            </div>
            <p class="text-xs text-slate-400">
              {Math.round(uploadProgress.loaded / 1024)} KB /{" "}
              {Math.round(uploadProgress.total / 1024)} KB
            </p>
          </div>
        ) : (
          <>
            <div class="text-4xl text-slate-400">📷</div>
            <div class="text-center">
              <p class="text-sm font-medium text-slate-300">
                {dragActive ? "Drop your file here" : "Drag and drop or click to browse"}
              </p>
              <p class="text-xs text-slate-400 mt-1">
                {accept.includes("image") ? "Images only" : "Any file type"} • Max {maxSize}MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
