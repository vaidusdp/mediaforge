"use client";

import React, { useEffect, useRef, useState } from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats = {
  "Instagram Square": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1"
  },
  "Instagram Portrait": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5"
  },
  "Twitter Post": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9"
  },
  "Twitter Header": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1"
  },
  "Facebook Cover": {
    width: 820,
    height: 312,
    aspectRatio: "2:1"
  }
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectFormat, setSelectFormat] = useState<SocialFormat>("Instagram Square");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if(uploadedImage){
      setIsTransforming(true);
    }
  }, [selectFormat, uploadedImage]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData
      });
      
      if(!response.ok){
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setUploadedImage(data.publicId)
    } catch (error) {
      console.log(error);
      alert("Failed To Upload Image");
    } finally {
      setIsUploading(false);
    }
  }

  const handleDownload = () => {
    if(!imageRef.current) return;

    fetch(imageRef.current.src)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error downloading image:", error))
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:text-5xl">
          Social Media Image Resizer
        </h1>
        <p className="mt-2 text-base-content/70">
          Upload and instantly format images for different social media platforms
        </p>
      </div>

      <div className="card w-full bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body gap-6">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Upload Your Image</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full shadow-sm hover:border-primary transition-all duration-300"
              accept="image/*"
            />
          </div>

          {isUploading && (
            <div className="flex flex-col gap-2 animate-pulse">
              <div className="flex justify-between text-xs font-semibold text-primary">
                <span>Uploading to Cloudinary...</span>
              </div>
              <progress className="progress progress-primary w-full h-2"></progress>
            </div>
          )}

          {uploadedImage && (
            <div className="space-y-6 animate-fadeIn">
              <div className="divider"></div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Select Destination Format</span>
                </label>
                <select
                  className="select select-bordered select-primary w-full shadow-sm"
                  value={selectFormat}
                  onChange={(e) => setSelectFormat(e.target.value as SocialFormat)}
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format} ({socialFormats[format as SocialFormat].aspectRatio})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <h3 className="text-md font-bold text-base-content/80">Preview Aspect Ratio:</h3>
                <div className="relative flex justify-center items-center bg-base-200 rounded-xl overflow-hidden min-h-[300px] border border-base-300 p-4">
                  {isTransforming && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm z-10 gap-3">
                      <span className="loading loading-ring loading-lg text-primary"></span>
                      <span className="text-sm font-medium text-base-content/70 animate-bounce">Applying transformation...</span>
                    </div>
                  )}
                  
                  <div className="max-w-full max-h-[500px] flex items-center justify-center shadow-lg rounded-lg overflow-hidden">
                    <CldImage
                      width={socialFormats[selectFormat].width}
                      height={socialFormats[selectFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="Transformed output preview"
                      crop="fill"
                      aspectRatio={socialFormats[selectFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-primary btn-block sm:w-auto shadow-lg hover:shadow-primary/30 transition-all duration-300" 
                  onClick={handleDownload}
                >
                  Download {selectFormat.split(" (")[0]}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

