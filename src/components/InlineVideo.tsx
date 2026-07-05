import type React from "react";
import { useRef, useState } from "react";

interface InlineVideoProps {
  src: string;
  posterSrc?: string;
  label: string;
  className?: string;
  fallbackImage?: string;
  /** Whether the video starts muted. Defaults to true. */
  defaultMuted?: boolean;
}

/**
 * A small, self-contained <video> player with a play/pause button and a
 * mute/unmute toggle. If the video file 404s (not supplied yet), it either
 * hides itself entirely or shows a fallback image, so a missing asset never
 * breaks the layout.
 */
export function InlineVideo({
  src,
  posterSrc,
  label,
  className,
  fallbackImage,
  defaultMuted = true,
}: InlineVideoProps): React.ReactElement | null {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [hasError, setHasError] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const togglePlay = (): void => {
    const video = videoRef.current;
    if (!video) return;

    if (hasEnded) {
      video.currentTime = 0;
      setHasEnded(false);
    }

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (): void => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  if (hasError) {
    if (!fallbackImage) return null;
    return <img src={fallbackImage} alt={label} className={`${className ?? ""} inline-video__fallback-image`} />;
  }

  return (
    <div className={`inline-video ${className ?? ""}`} data-ended={hasEnded ? "true" : "false"}>
      <video
        ref={videoRef}
        className="inline-video__video"
        src={src}
        poster={posterSrc}
        muted={isMuted}
        playsInline
        preload="none"
        onError={() => setHasError(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setHasEnded(true);
        }}
      />
      <div className="inline-video__controls">
        <button
          type="button"
          className="inline-video__play-button"
          onClick={togglePlay}
          aria-label={hasEnded ? `Replay ${label} video` : isPlaying ? `Pause ${label} video` : `Play ${label} video`}
        >
          {hasEnded ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
          ) : isPlaying ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="inline-video__mute-button"
          onClick={toggleMute}
          aria-label={isMuted ? `Unmute ${label} video` : `Mute ${label} video`}
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M3 10v4h4l5 5V5L7 10H3z" />
              <line x1="16" y1="9" x2="21" y2="14" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="9" x2="16" y2="14" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M3 10v4h4l5 5V5L7 10H3z" />
              <path
                d="M16 8a5 5 0 0 1 0 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
