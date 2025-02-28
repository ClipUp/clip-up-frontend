import { useRef, useState, useEffect } from "react";
import "./audioController.scss";
import Pause from "../../../assets/icon/pause.svg";
import Start from "../../../assets/icon/start.svg";

const AudioController = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnd = () => {
        setCurrentTime(audio.duration); // 오디오 끝나면 currentTime을 마지막 시간으로 설정
        setIsPlaying(false); // 오디오 끝나면 멈춤 상태로 설정
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

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev); // 현재 상태를 반전시켜서 재생/멈춤을 토글
  };

  const seek = (offset) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      Math.max(audioRef.current.currentTime + offset, 0),
      duration
    );
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
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                transform: `scaleX(${duration > 0 ? currentTime / duration : 0})`,
              }}
            />
          </div>
          <div className="progress-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="controller-group">
          <button className="seek-backward" onClick={() => seek(-5)}>
          </button>
          <button className="toggle-play" onClick={togglePlay}>
            {isPlaying ? <img src={Pause} /> : <img src={Start} />}
          </button>
          <button className="seek-forward" onClick={() => seek(5)}>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioController;
