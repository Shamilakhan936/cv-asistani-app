"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ProfileImageProps {
  src: string
  variant?: "rounded" | "square"
  className?: string
  alt?: string
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, variant = "rounded", className = "", alt = "Profile" }) => {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)
  const [imageLoaded, setImageLoaded] = useState(false)

  const defaultAvatar =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHJ4PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwNUM4NS4wMzggMTA1IDczIDkyLjk2MiA3MyA3OEM3MyA2My4wMzggODUuMDM4IDUxIDEwMCA1MUMxMTQuOTYyIDUxIDEyNyA2My4wMzggMTI3IDc4QzEyNyA5Mi45NjIgMTE0Ljk2MiAxMDUgMTAwIDEwNVpNMTQ3IDE0NUMxNDcgMTM1LjA1OSAxMzkuMjgxIDEyNi4zOTUgMTI4LjE5MSAxMjEuNjNDMTIwLjA4IDEyOC4yMjkgMTEwLjM5NiAxMzIgMTAwIDEzMkM4OS42MDQzIDEzMiA3OS45MTk5IDEyOC4yMjkgNzEuODA5MyAxMjEuNjNDNjAuNzE4NyAxMjYuMzk1IDUzIDEzNS4wNTkgNTMgMTQ1VjE0OUgxNDdWMTQ1WiIgZmlsbD0iIzk0QTNCOCIvPjwvc3ZnPg=="

  useEffect(() => {
    if (src && src !== defaultAvatar) {
      setImageSrc(src)
      setImageError(false)
      setImageLoaded(false)

      const img = new Image()
      img.onload = () => setImageLoaded(true)
      img.onerror = () => {
        console.warn(`Failed to load profile image: ${src}`)
        setImageError(true)
      }
      img.src = src
    } else {
      setImageSrc(defaultAvatar)
      setImageLoaded(true)
    }
  }, [src])

  const displaySrc = imageError || !imageSrc ? defaultAvatar : !imageLoaded ? defaultAvatar : imageSrc

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-gray-200",
        variant === "rounded" ? "rounded-full" : "rounded-md",
        className,
      )}
    >
      <img
        src={displaySrc || "/placeholder.svg"}
        alt={alt}
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  )
}

export default ProfileImage
