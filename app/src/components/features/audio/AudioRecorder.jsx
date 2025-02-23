import { useEffect, useRef, useState } from "react";
import AudioRecorderUtil from "../../../utils/audioRecorderUtil";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);

  useEffect(() => {
    recorderRef.current = new AudioRecorderUtil(
      (dataArray) => drawWaveform(dataArray),
      (audioBlob) => handleAudioSave(audioBlob)
    );
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    recorderRef.current.startRecording();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorderRef.current.stopRecording();
  };

  const handleAudioSave = (audioBlob) => {
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
  };

  const drawWaveform = (dataArray) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = dataArray[i] / 2;
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  return (
    <div>
      <h2>음성 녹음</h2>
      <canvas ref={canvasRef} width="400" height="100" style={{ border: "1px solid #ddd" }}></canvas>
      <div>
        {isRecording ? (
          <button onClick={stopRecording} style={{ backgroundColor: "red", color: "white" }}>
            녹음 종료
          </button>
        ) : (
          <button onClick={startRecording} style={{ backgroundColor: "green", color: "white" }}>
            녹음 시작
          </button>
        )}
      </div>
      {audioUrl && (
        <div>
          <h3>녹음된 음성</h3>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
