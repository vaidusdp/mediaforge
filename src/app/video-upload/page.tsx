"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) return;

    if(file.size > MAX_FILE_SIZE){
      alert("File Size Too Large");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    setIsUploading(true);

    try {
      const response = await axios.post("/api/video-upload", formData);

      const data = await response.data;
    } catch (error) {
      console.log(error);
      alert("Failed To Upload Video");
    }  finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent sm:text-5xl">
          Upload Video
        </h1>
        <p className="mt-2 text-base-content/70">
          Upload and share your videos easily
        </p>
      </div>

      <div className="card w-full bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Video Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered input-primary w-full shadow-sm"
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                placeholder="Write something about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered textarea-primary w-full h-28 shadow-sm"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Choose Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered file-input-primary w-full shadow-sm"
                required
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">Max file size: 70 MB</span>
              </label>
            </div>

            <div className="form-control mt-4">
              <button
                type="submit"
                className={`btn btn-primary w-full shadow-lg transition-all duration-300`}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="loading loading-spinner loading-sm"></span>
                    Uploading Video...
                  </span>
                ) : (
                  "Upload Video"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload