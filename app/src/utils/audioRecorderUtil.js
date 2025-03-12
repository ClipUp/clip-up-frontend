class AudioRecorder {
  constructor(onDataAvailable, onStopRecording) {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.maxDuration = 60 * 60 * 1000; // 60분
    this.onDataAvailable = onDataAvailable;
    this.onStopRecording = onStopRecording;
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.animationFrameId = null;
    this.silentDuration = 0; // 묵음 지속 시간
    this.isRecording = true; // 녹음 상태
    this.isPaused = false; // 일시정지 상태
    this.recordingStartTime = null; // 현재 녹음 세션의 시작 시간
    this.elapsedTime = 0; // 누적 녹음 시간 (ms)
  }

  async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      source.connect(this.analyser);

      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      this.recordingStartTime = Date.now();
      this.elapsedTime = 0;
      this.isPaused = false;
      this.isRecording = true;
      return new Promise((resolve) => {
        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
          const wavBlob = await this.convertToWav(audioBlob); // WAV 형식으로 변환
          this.onStopRecording(wavBlob, this.elapsedTime); // WAV 파일 전달
          this.stopVisualizeWaveform();
          resolve("stopped"); // 녹음 중지
        };

        this.mediaRecorder.start();
        this.visualizeWaveform();

        setTimeout(() => {
          if (this.mediaRecorder.state === "recording") {
            // 자동 종료 전까지의 시간 업데이트
            this.elapsedTime += Date.now() - this.recordingStartTime;
            this.mediaRecorder.stop();
            resolve("max"); // 녹음 자동 종료
          }
        }, this.maxDuration);
      });
    } catch (error) {
      console.error("음성 녹음 시작 실패:", error);
      throw error;
    }
  }

  async convertToWav(blob) {
    const arrayBuffer = await blob.arrayBuffer();

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const wavBlob = this.audioBufferToWav(audioBuffer);
      return wavBlob;
    } catch (err) {
      console.error("decodeAudioData 오류:", err);
      return null;
    }
  }

  audioBufferToWav(audioBuffer) {
    const numOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const numFrames = audioBuffer.length;

    const bufferSize = 44 + numFrames * numOfChannels * 2;
    const wavBuffer = new Uint8Array(bufferSize);
    const view = new DataView(wavBuffer.buffer);

    let offset = 0;

    const writeString = (s) => {
      for (let i = 0; i < s.length; i++) {
        view.setUint8(offset++, s.charCodeAt(i));
      }
    };

    writeString("RIFF");
    view.setUint32(offset, bufferSize - 8, true); offset += 4;
    writeString("WAVE");
    writeString("fmt ");
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2; // PCM 포맷
    view.setUint16(offset, numOfChannels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * numOfChannels * 2, true); offset += 4;
    view.setUint16(offset, numOfChannels * 2, true); offset += 2;
    view.setUint16(offset, 16, true); offset += 2; // 16-bit PCM
    writeString("data");
    view.setUint32(offset, numFrames * numOfChannels * 2, true); offset += 4;

    for (let channel = 0; channel < numOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < numFrames; i++) {
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([wavBuffer], { type: "audio/wav" });
  }

  visualizeWaveform() {
    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);
      this.analyser.getByteFrequencyData(this.dataArray);
      this.onDataAvailable(this.dataArray);
    };
    draw();
  }

  stopVisualizeWaveform() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      // 현재까지의 녹음 시간 저장
      this.elapsedTime += Date.now() - this.recordingStartTime;
      this.recordingStartTime = null;
      this.mediaRecorder.pause();
      this.isPaused = true;
      this.stopVisualizeWaveform();
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
      this.recordingStartTime = Date.now();
      this.isPaused = false;
      this.visualizeWaveform();
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.elapsedTime += Date.now() - this.recordingStartTime;
      this.recordingStartTime = null;
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    cancelAnimationFrame(this.animationFrameId);
  }

  getRecordingTime() {
    if (this.recordingStartTime === null) {
      return this.elapsedTime;
    }
    return this.elapsedTime + (Date.now() - this.recordingStartTime);
  }

  monitorAudio() {
    this.audioCheckInterval = setInterval(() => {
      this.analyser.getByteFrequencyData(this.dataArray);

      const silenceThreshold = 50;
      if (this.getVolume() < silenceThreshold) {
        this.silentDuration += 100;
        if (this.silentDuration >= 500 && this.isRecording) { // 0.5초 이상 묵음
          this.mediaRecorder.pause();
          this.isRecording = false;
        }
      } else {
        this.silentDuration = 0;
        if (!this.isRecording && this.mediaRecorder.state === "paused") {
          this.mediaRecorder.resume(); // paused 상태일 때만 resume
          this.isRecording = true;
        }
      }
    }, 100);
  }

  getVolume() {
    return this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
  }
}

export default AudioRecorder;
