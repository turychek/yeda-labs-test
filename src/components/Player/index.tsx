import React, { useRef, useEffect, useState, FC } from 'react';
import Hls from 'hls.js';
import styles from './styles.module.scss';
import Tooltip from '../Tooltip';
import Pause from '../../assets/Pause';
import Play from '../../assets/Play';
import Volume from '../../assets/Volume';
import FullScreen from '../../assets/FullScreen';
import FullscreenExit from '../../assets/FullscreenExit';
import Yeda from '../../assets/Yeda';
import VolumeOff from '../../assets/VolumeOff';
import Settings from '../Settings';

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface Chapter {
  title: string;
  start: number;
  end: number;
}

interface PlayerProps {
  hlsPlaylistUrl: string;
  videoLength: number;
  chapters: Chapter[];
}

const Player: FC<PlayerProps> = ({ hlsPlaylistUrl, videoLength, chapters }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverChapter, setHoverChapter] = useState<Chapter | null>(null);
  const [qualityLevels, setQualityLevels] = useState<any[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let hls: Hls | null = null;
    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(hlsPlaylistUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setQualityLevels(hls!.levels);
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          setCurrentLevel(data.level);
        });
        // @ts-ignore
        videoRef.current.hls = hls;
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = hlsPlaylistUrl;
      }
      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current!.currentTime);
      });
    }
    return () => {
      if (hls) hls.destroy();
    };
  }, [hlsPlaylistUrl]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * videoLength;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * videoLength;
    setHoverTime(time);
    const chapter = chapters.find((ch) => time >= ch.start && time <= ch.end);
    setHoverChapter(chapter || null);
  };

  const handleTimelineLeave = () => {
    setHoverTime(null);
    setHoverChapter(null);
  };

  const handleQualityChange = (levelIndex: number) => {
    if (videoRef.current && Hls.isSupported()) {
      // @ts-ignore
      const hls = videoRef.current.hls as Hls;
      if (hls) hls.currentLevel = levelIndex;
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className={styles.playerWrapper}>
      <video ref={videoRef} onClick={handlePlayPause} className={styles.video} />
      <div className={styles.controls}>
        <div
          className={styles.timeline}
          onClick={handleTimelineClick}
          onMouseMove={handleTimelineHover}
          onMouseLeave={handleTimelineLeave}
        >
          <div
            className={styles.progress}
            style={{ width: `${(currentTime / videoLength) * 100}%` }}
          />
          <div
            className={styles.progressEnd}
            style={{ left: `calc(${(currentTime / videoLength) * 100}% - 2px)` }}
          />
          <div className={styles.chapters}>
            {chapters.map((ch, idx) => (
              <div
                key={idx}
                className={styles.chapter}
                style={{
                  left: `${(ch.start / videoLength) * 100}%`,
                  width: `${((ch.end - ch.start) / videoLength) * 100}%`,
                }}
              />
            ))}
          </div>

          <Tooltip
            hoverTime={hoverTime}
            videoLength={videoLength}
            hoverChapter={hoverChapter}
            formatTime={formatTime}
          />
        </div>
        <div className={styles.controlActions}>
          <div className={styles.controlBtnGroup}>
            <button onClick={handlePlayPause} className={styles.controlBtn}>
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={handleMute} className={styles.controlBtn}>
              {isMuted ? <VolumeOff /> : <Volume />}
            </button>
            <span className={styles.time}>
              {formatTime(currentTime)} / {formatTime(videoLength)}
            </span>
          </div>

          <div className={styles.controlBtnGroup}>
            <Settings
              qualityLevels={qualityLevels}
              currentLevel={currentLevel}
              onQualityChange={handleQualityChange}
            />
            <button onClick={handleFullscreen} className={styles.controlBtn}>
              {isFullscreen ? <FullscreenExit /> : <FullScreen />}
            </button>
            <Yeda />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
