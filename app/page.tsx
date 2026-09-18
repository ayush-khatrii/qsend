"use client";

import { useRef, useState, type DragEvent } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  File,
  FileArchive,
  FileImage,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return (
    (bytes / 1024 ** unitIndex).toFixed(unitIndex === 0 ? 0 : 1) +
    " " +
    units[unitIndex]
  );
}

function FileTypeIcon({ file }: { file: File }) {
  if (file.type.startsWith("image/")) return <FileImage aria-hidden="true" />;
  if (file.type.includes("zip") || file.type.includes("compressed")) {
    return <FileArchive aria-hidden="true" />;
  }
  if (file.type.startsWith("text/") || file.type.includes("document")) {
    return <FileText aria-hidden="true" />;
  }

  return <File aria-hidden="true" />;
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incomingFiles: File[]) => {
    setFiles((currentFiles) => {
      const allFiles = [...currentFiles, ...incomingFiles];
      const uniqueFiles = new Map(
        allFiles.map((file) => [
          file.name + "-" + file.size + "-" + file.lastModified,
          file,
        ]),
      );

      return Array.from(uniqueFiles.values());
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const removeFile = (fileToRemove: File) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file !== fileToRemove),
    );
  };

  const totalSize = files.reduce((total, file) => total + file.size, 0);

  return (
    <main className="relative min-h-svh overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border)_1px,transparent_1px)] bg-[size:28px_28px] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 size-[32rem] rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 size-[30rem] rounded-full bg-muted/60 blur-3xl"
      />

      <div className="relative mx-auto grid mt-10 w-full max-w-7xl px-5">
        <header className="flex h-20 items-center justify-between sm:h-24">
          <div className="flex items-center gap-3" aria-label="QSend home">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
              <ArrowRight className="size-5 -rotate-45" aria-hidden="true" />
            </div>
            <span className="text-xl font-semibold tracking-[-0.03em]">QSend</span>
          </div>
        </header>

        <section className="grid items-center gap-10 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-10">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm sm:text-sm">
              <Sparkles className="size-3.5 text-foreground" aria-hidden="true" />
              Fast, private, effortless file sharing
            </div>

            <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Your files. Their device.{" "}
              <span className="text-muted-foreground">Just like that.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0">
              Send photos, videos, and documents in original quality. No account,
              no app, no complicated setup, simply upload and share.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-muted-foreground lg:justify-start">
              {["Original quality", "No sign-up", "Expires in 24 hours"].map(
                (benefit) => (
                  <span key={benefit} className="inline-flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-secondary text-secondary-foreground">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {benefit}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="rounded-[1.35rem] border border-border bg-card p-4 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      Start sharing
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add any files you want to send.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/70 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    Multiple files
                  </div>
                </div>

                <input
                  ref={inputRef}
                  id="file-upload"
                  className="sr-only"
                  type="file"
                  multiple
                  onChange={(event) => {
                    addFiles(Array.from(event.target.files ?? []));
                    event.target.value = "";
                  }}
                />

                <div
                  className={cn(
                    "group relative grid min-h-48 cursor-pointer place-items-center rounded-2xl border border-dashed p-6 text-center outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isDragging
                      ? "scale-[0.99] border-foreground bg-secondary"
                      : "border-border bg-muted/30 hover:border-muted-foreground/60 hover:bg-muted/50",
                  )}
                  role="button"
                  tabIndex={0}
                  aria-label="Choose files to upload"
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      inputRef.current?.click();
                    }
                  }}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                      setIsDragging(false);
                    }
                  }}
                  onDrop={handleDrop}
                >
                  <div>
                    <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-border bg-background shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                      <UploadCloud className="size-6" aria-hidden="true" />
                    </div>
                    <p className="mt-4 font-medium">
                      Drop your files here, or{" "}
                      <span className="underline decoration-muted-foreground/50 underline-offset-4">
                        browse
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Photos, videos, documents, and more
                    </p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2" aria-live="polite">
                    {files.slice(0, 2).map((file) => (
                      <div
                        key={file.name + "-" + file.size + "-" + file.lastModified}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-2.5"
                      >
                        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground [&>svg]:size-4">
                          <FileTypeIcon file={file} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={"Remove " + file.name}
                          onClick={() => removeFile(file)}
                        >
                          <X className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}

                    {files.length > 2 && (
                      <p className="px-1 text-xs text-muted-foreground">
                        +{files.length - 2} more{" "}
                        {files.length - 2 === 1 ? "file" : "files"}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  {files.length > 0 && (
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Add more files"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={files.length === 0}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {files.length > 0
                      ? "Create share link"
                      : "Add files to get started"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>

                {files.length > 0 && (
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    {formatFileSize(totalSize)} selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="flex h-16 items-center justify-center gap-2 text-xs text-muted-foreground sm:justify-start">
          <Clock3 className="size-3.5" aria-hidden="true" />
          Your files are automatically deleted after 24 hours.
        </div>
      </div>
    </main>
  );
}
