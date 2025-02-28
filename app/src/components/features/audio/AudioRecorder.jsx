import { useEffect, useRef, useState } from "react";
import { useCreateNote } from "../../../hooks/useNote";
import AudioRecorderUtil from "../../../utils/audioRecorderUtil";
import Microphone from "../../../assets/icon/microphone-circle.svg"
import {formatTimeHHmmSS} from "../../../utils/dateUtil"
import "./audioRecorder.scss"
import Stop from "../../../assets/icon/stop.svg";
import Pause from "../../../assets/icon/pause.svg";
import Start from "../../../assets/icon/start.svg";


const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  // const [audioUrl, setAudioUrl] = useState(null);
  // const canvasRef = useRef(null);
  const recorderRef = useRef(null);
  const noteMutation = useCreateNote();
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    recorderRef.current = new AudioRecorderUtil(
      (dataArray) => drawWaveform(dataArray),
      (audioBlob) => handleAudioSave(audioBlob)
    );
    const interval = setInterval(() => {
      if (recorderRef.current && recorderRef.current.getRecordingTime) {
        setRecordingTime(recorderRef.current.getRecordingTime());
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (recorderRef.current) {
        recorderRef.current.stopRecording();
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    if (recorderRef.current.isPaused) {
      recorderRef.current.resumeRecording();
    } else {
      recorderRef.current.startRecording();
    }
  };

  const pauseRecording = () => {
    setIsRecording(false);
    recorderRef.current.pauseRecording();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recorderRef.current.stopRecording();
  };

  const handleAudioSave = async (wavBlob) => {
    const bars = document.querySelectorAll("#audioWave rect");
    // const url = URL.createObjectURL(wavBlob);

    // setAudioUrl(url);
    bars.forEach((bar) => {
      bar.setAttribute("fill", "#B0B0B0");
    });
    // const downloadBlob = (blob, filename) => {
    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = filename;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // };

    // downloadBlob(wavBlob, "test.wav");
    await noteMutation.mutateAsync(wavBlob);
  };

  const drawWaveform = (dataArray) => {
    const bars = document.querySelectorAll("#audioWave rect");
    const totalBars = bars.length;
    const activeBars = Math.floor((recorderRef.current.getVolume() / 255) * totalBars);

    bars.forEach((bar, index) => {
        if (index < activeBars) {
            bar.setAttribute("fill", "#464242");
        } else {
            bar.setAttribute("fill", "#B0B0B0");
        }
    });
  };

  return (
    <div className="audio-recorder-card">
      <div className="gradient"></div>
      <div className="audio-recorder">
        <div className="record-info-group">
          <img src={Microphone} />
          <svg id="audioWave" width="90" height="34" viewBox="0 0 90 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect opacity="0.5" y="15.6978" width="2.09302" height="2.09302" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="6.27907" y="12.5581" width="2.09302" height="8.37209" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="12.5581" y="9.41846" width="2.09302" height="14.6512" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="18.8372" y="14.6509" width="2.09302" height="4.18605" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="25.1163" y="8.37207" width="2.09302" height="16.7442" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="31.3954" y="9.41846" width="2.09302" height="14.6512" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="37.6744" y="11.5117" width="2.09302" height="10.4651" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="43.9535" y="11.5117" width="2.09302" height="10.4651" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="50.2326" y="11.5117" width="2.09302" height="10.4651" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="56.5116" y="9.41846" width="2.09302" height="14.6512" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="62.7907" y="11.5117" width="2.09302" height="10.4651" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="69.0698" y="8.37207" width="2.09302" height="16.7442" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="75.3488" y="11.5117" width="2.09302" height="10.4651" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="81.6279" y="14.6509" width="2.09302" height="4.18605" rx="1.04651" fill="#464242"/>
            <rect opacity="0.5" x="87.907" y="15.6978" width="2.09302" height="2.09302" rx="1.04651" fill="#464242"/>
          </svg>
          <span>{formatTimeHHmmSS(recordingTime)}</span>
        </div>
        <div className="controller-group">
          {isRecording ? (
            <button className="pause" onClick={pauseRecording}>
              <img src={Pause}/>
            </button>
          ) : (
            <button className="start" onClick={startRecording}>
              <img src={Start}/>
            </button>
          )}
          <button className="stop" onClick={stopRecording}>
            <img src={Stop}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
