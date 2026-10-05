// =========================================================
//  VideoPlayer Component
//  - Video URL comes from the API (never hardcoded)
//  - Includes watermark overlay for user-specific deterrence
//  - Right-click disabled as a deterrent (not true DRM)
// =========================================================

import { useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './VideoPlayer.module.css';

function parseVideoSource(url) {
  if (!url) return { type: 'none' };
  const cleanUrl = String(url).trim();

  // 1. YouTube
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // 2. Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&title=0&byline=0`,
    };
  }

  // 3. Loom
  const loomMatch = cleanUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/i);
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
    };
  }

  // 4. Google Drive
  const driveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
    };
  }

  // 5. Default direct HTML5 stream
  return {
    type: 'html5',
    url: cleanUrl,
  };
}

export default function VideoPlayer({ videoUrl, src, lessonTitle, title, initialTime = 0, onEnded, onTimeUpdate }) {
  const activeVideoUrl = videoUrl || src;
  const activeTitle = lessonTitle || title;
  const videoSource = parseVideoSource(activeVideoUrl);
  const videoRef = useRef(null);
  const { currentUser } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [buffered, setBuffered] = useState(0);
  const controlsTimer = useRef(null);
  const initialTimeSet = useRef(false);

  // Reset initialTimeSet on videoUrl change
  useEffect(() => {
    initialTimeSet.current = false;
  }, [activeVideoUrl]);

  // Auto-hide controls after 3s of inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    if (playing) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    return () => clearTimeout(controlsTimer.current);
  }, []);

  const handleContextMenu = (e) => e.preventDefault();

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const skipTime = useCallback((seconds) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + seconds), v.duration || 0);
  }, []);

  const changeSpeed = useCallback((speed) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = speed;
    setPlaybackSpeed(speed);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = videoRef.current?.parentElement;
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipTime, toggleFullscreen, toggleMute]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
    onTimeUpdate?.(v.currentTime, v.duration);
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) {
      setDuration(v.duration);
      v.playbackRate = playbackSpeed;
      if (initialTime > 0 && !initialTimeSet.current && initialTime < v.duration - 5) {
        v.currentTime = initialTime;
        initialTimeSet.current = true;
      }
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setShowControls(true);
    onEnded?.();
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setMuted(val === 0);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  if (!activeVideoUrl) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.placeholderIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <p className={styles.placeholderText}>Select a lesson to start watching</p>
      </div>
    );
  }

  // Embeddable Iframe Providers (YouTube / Vimeo / Loom / Google Drive)
  if (videoSource.type !== 'html5' && videoSource.embedUrl) {
    return (
      <div className={styles.container} onContextMenu={handleContextMenu}>
        <iframe
          src={videoSource.embedUrl}
          title={activeTitle || 'Lesson Video'}
          className={styles.iframeEmbed}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {currentUser && (
          <div className={styles.watermark} aria-hidden="true">
            {currentUser.email}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      onMouseMove={resetControlsTimer}
      onContextMenu={handleContextMenu}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className={styles.video}
        src={activeVideoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onClick={togglePlay}
        controlsList="nodownload"
        disablePictureInPicture
        playsInline
      />

      {/* Watermark */}
      {currentUser && (
        <div className={styles.watermark} aria-hidden="true">
          {currentUser.email}
        </div>
      )}

      {/* Play/pause overlay click area */}
      <div className={styles.clickOverlay} onClick={togglePlay}>
        {!playing && (
          <div className={styles.playBtn} aria-label="Play">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#030708">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={[styles.controls, showControls || !playing ? styles.visible : ''].join(' ')}>
        {/* Lesson title */}
        {activeTitle && <p className={styles.lessonTitle}>{activeTitle}</p>}

        {/* Progress bar */}
        <div className={styles.progressArea}>
          <div className={styles.progressTrack} onClick={handleSeek} role="slider" aria-label="Seek" aria-valuenow={Math.round(progressPercent)} aria-valuemin={0} aria-valuemax={100}>
            <div className={styles.bufferedBar} style={{ width: `${buffered}%` }} />
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}>
              <div className={styles.progressDot} />
            </div>
          </div>
          <div className={styles.timeDisplay}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Bottom controls */}
        <div className={styles.bottomBar}>
          <div className={styles.leftControls}>
            <button className={styles.ctrlBtn} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
            </button>

            {/* 10s skip buttons */}
            <button className={styles.ctrlBtn} onClick={() => skipTime(-10)} aria-label="Rewind 10s" title="Rewind 10s (←)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
            </button>
            <button className={styles.ctrlBtn} onClick={() => skipTime(10)} aria-label="Forward 10s" title="Forward 10s (→)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </button>

            <div className={styles.volumeWrap}>
              <button className={styles.ctrlBtn} onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
                )}
              </button>
              <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} onChange={handleVolume} className={styles.volumeSlider} aria-label="Volume" />
            </div>
          </div>

          <div className={styles.rightControls}>
            {/* Speed Selector */}
            <div className={styles.speedWrap}>
              {[1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  className={[styles.speedBtn, playbackSpeed === s ? styles.speedActive : ''].join(' ')}
                  onClick={() => changeSpeed(s)}
                  aria-label={`Playback speed ${s}x`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button className={styles.ctrlBtn} onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title="Fullscreen (f)">
              {fullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
