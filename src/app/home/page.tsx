"use client"

import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/generated/prisma/client'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get<Video[]>("/api/video")
      setVideos(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching videos:", error)
      setError("Failed to load videos. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${title}.mp4`)
    link.setAttribute("target", "_blank")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="text-base-content/70 font-medium">Loading videos...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/60 text-sm mt-1">Manage and compress your uploaded videos</p>
        </div>
        <button 
          onClick={fetchVideos}
          className="btn btn-outline btn-sm gap-2"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error shadow-sm mb-6">
          <span>{error}</span>
        </div>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-300 shadow-sm">
          <h2 className="text-xl font-bold text-base-content mb-2">No videos found</h2>
          <p className="text-base-content/65 mb-6 max-w-sm mx-auto">
            You haven't uploaded any videos yet. Go to the upload page to get started.
          </p>
          <a href="/video-upload" className="btn btn-primary">
            Upload Your First Video
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onDownload={handleDownload} 
            />
          ))}
        </div>
      )}
    </div>
  )
}