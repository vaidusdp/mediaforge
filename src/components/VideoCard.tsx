"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/generated/prisma/client";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [retry, setRetry] = useState(0);

  const getThumbnailURL = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      quality: "auto",
      format: "jpg",
      assetType: "video",
    });
  }, []);

  const getPreviewVideoURL = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      quality: "auto",
      format: "mp4",
    });
  }, []);

  const getFullVideoURL = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      format: "mp4",
    });
  }, []);

  const formatSize = (size: number) => filesize(size);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const compressVideoPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.orignalSize)) * 100
  );

  useEffect(() => {
    if (!isHovered) return;

    const timer = setTimeout(() => {
      setRetry((r) => r + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [retry, isHovered]);

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRetry(0);
      }}
    >
      <figure className="relative aspect-video bg-base-300 overflow-hidden">
        {isHovered ? (
          <video
            key={retry}
            src={getPreviewVideoURL(video.publicId)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
            onLoadedData={() => console.log("Preview Ready")}
            onError={() => {
              console.log("Cloudinary still processing...");
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={getThumbnailURL(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute bottom-2 right-2 bg-blue-950/75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Clock size={12} />
          {formatDuration(video.duration)}
        </div>

        {compressVideoPercentage > 0 && (
          <div className="absolute top-2 right-2 badge badge-success">
            Save {compressVideoPercentage}%
          </div>
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title">{video.title}</h2>

        {video.description && <p>{video.description}</p>}

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <FileUp size={14} />
              Original
            </span>
            <span>{formatSize(Number(video.orignalSize))}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <FileDown size={14} />
              Compressed
            </span>
            <span>{formatSize(Number(video.compressedSize))}</span>
          </div>

          <div className="text-xs">
            Uploaded {dayjs(video.createdAt).fromNow()}
          </div>
        </div>

        <button
          className="btn btn-primary mt-4"
          onClick={() =>
            onDownload(getFullVideoURL(video.publicId), video.title)
          }
        >
          <Download size={18} />
          Download
        </button>
      </div>
    </div>
  );
};

export default VideoCard;