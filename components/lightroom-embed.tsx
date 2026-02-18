"use client"

/**
 * LightroomEmbed component
 *
 * To embed images from Adobe Lightroom Cloud:
 *
 * 1. Open your Lightroom album on lightroom.adobe.com
 * 2. Click "Share & Invite" → "Get Link"
 * 3. Enable sharing and copy the public album URL
 * 4. For individual images, right-click → "Copy image address"
 *    The URL will look like: https://lightroom.adobe.com/v2c/spaces/...
 *
 * You can also use Lightroom's embed feature:
 * - Go to lightroom.adobe.com
 * - Select an album → Share → Embed
 * - Copy the embed code and extract the src URL
 *
 * Replace the `src` props in the portfolio-grid.tsx file
 * with your Lightroom image URLs.
 */

interface LightroomEmbedProps {
  albumUrl: string
  title?: string
  className?: string
}

export function LightroomEmbed({ albumUrl, title = "Gallery", className = "" }: LightroomEmbedProps) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <iframe
        src={albumUrl}
        title={title}
        className="h-[600px] w-full border-0 md:h-[800px]"
        loading="lazy"
        allowFullScreen
      />
    </div>
  )
}
