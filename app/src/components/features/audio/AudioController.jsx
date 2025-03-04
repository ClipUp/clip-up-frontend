import { useRef, useState, useEffect } from "react";
import "./audioController.scss";
import Pause from "../../../assets/icon/pause.svg";
import Start from "../../../assets/icon/start.svg";

const AudioController = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnd = () => {
        setCurrentTime(audio.duration);
        setIsPlaying(false);
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", handleEnd);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", handleEnd);
      };
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleProgressMouseMove);
      window.addEventListener("mouseup", handleProgressMouseUp);
    } else {
      window.removeEventListener("mousemove", handleProgressMouseMove);
      window.removeEventListener("mouseup", handleProgressMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleProgressMouseMove);
      window.removeEventListener("mouseup", handleProgressMouseUp);
    };
  }, [isDragging]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const skip = (offset) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      Math.max(audioRef.current.currentTime + offset, 0),
      duration
    );
  };

  const seek = (clientX) => {
    if (!progressBarRef.current || !audioRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const newProgress = Math.max(0, Math.min(clickX / rect.width, 1));

    audioRef.current.currentTime = newProgress * audioRef.current.duration;
    progressBarRef.current.querySelector(".progress-fill").style.transform = `scaleX(${newProgress})`;
  };

  const handleProgressMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    seek(e.clientX);
  };

  const handleProgressMouseMove = (e) => {
    if (isDragging) {
      seek(e.pageX);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="audio-controller-card">
      <div className="gradient" />
      <div className="audio-controller">
        <audio ref={audioRef} src={audioUrl} />
        <div className="progress-group">
          <div
            ref={progressBarRef}
            className="progress-bar"
            onMouseDown={handleProgressMouseDown}
          >
            <div
              className="progress-fill"
              style={{transform: `scaleX(${duration > 0 ? currentTime / duration : 0})`,}}
            />
          </div>
          <div className="progress-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="controller-group">
          <button className="seek-backward" onClick={() => skip(-5)}>
          </button>
          <button className="toggle-play" onClick={togglePlay}>
            {isPlaying ? <img src={Pause} /> : <img src={Start} />}
          </button>
          <button className="seek-forward" onClick={() => skip(5)}>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioController;
