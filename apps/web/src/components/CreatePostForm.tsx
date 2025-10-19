import { Alert, Button, Textarea } from "@components/ui";
import { authStore } from "@services/auth";
import { savePost } from "@services/dataService";
import { useState } from "preact/hooks";
import { FileUpload } from "./FileUpload";

type UploadResult = {
  key: string;
  url: string;
};

export function CreatePostForm() {
  const [caption, setCaption] = useState("");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const authState = authStore.get();

  const handleUploadComplete = (result: UploadResult) => {
    setUploadResult(result);
    setError(null);
  };

  const handleUploadError = (error: string) => {
    setError(error);
    setUploadResult(null);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!authState.isAuthenticated) {
      setError("You must be logged in to create a post");
      return;
    }

    if (!caption.trim()) {
      setError("Please enter a caption");
      return;
    }

    if (!uploadResult) {
      setError("Please upload a photo");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      await savePost({
        caption: caption.trim(),
        photoStorageKey: uploadResult.key,
        photoUrl: uploadResult.url,
        feedId: "GLOBAL",
      });

      setSuccess(true);
      setCaption("");
      setUploadResult(null);

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="grid gap-5 lg:grid-cols-2">
      <div class="grid gap-3">
        <div class="grid gap-2 text-sm">
          <label htmlFor="caption">Caption</label>
          <Textarea
            id="caption"
            rows={5}
            placeholder="Share what's happening..."
            value={caption}
            onInput={(e) => setCaption((e.target as HTMLTextAreaElement).value)}
            disabled={isSubmitting}
          />
        </div>

        <div class="grid gap-2 text-sm">
          <span>Attach photo</span>
          <FileUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            accept="image/*"
            maxSize={10}
          />
        </div>

        {uploadResult && (
          <div class="rounded-xl border border-green-500/30 bg-green-500/10 p-3">
            <p class="text-sm text-green-200">✅ Photo uploaded successfully</p>
            <img
              src={uploadResult.url}
              alt="Uploaded content"
              class="mt-2 h-20 w-20 rounded-lg object-cover"
            />
          </div>
        )}

        <label class="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-white/20 bg-slate-900"
            defaultChecked
            disabled={isSubmitting}
          />
          Notify followers via SNS
        </label>

        {error && <Alert variant="danger">{error}</Alert>}

        {success && (
          <Alert variant="success">
            Post created successfully! It will appear in the feed after moderation.
          </Alert>
        )}
      </div>

      <aside class="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-300">
        <p class="font-semibold text-white">Workflow preview</p>
        <ol class="grid gap-3">
          <li>1. Upload file to S3 via Amplify</li>
          <li>2. Trigger `savePost` mutation (AppSync)</li>
          <li>3. Step Functions Express handles moderation</li>
          <li>4. Approved post updates DynamoDB + feed subscription</li>
        </ol>

        <Button
          type="submit"
          disabled={isSubmitting || !authState.isAuthenticated}
          loading={isSubmitting}
        >
          Submit Post
        </Button>

        {!authState.isAuthenticated && (
          <p class="text-xs text-amber-200">⚠️ You must be logged in to create posts</p>
        )}
      </aside>
    </form>
  );
}
