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

      return new Promise((resolve) => {
        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
          const wavBlob = await this.convertToWav(audioBlob); // WAV 형식으로 변환
          this.onStopRecording(wavBlob); // WAV 파일 전달
          this.stopVisualizeWaveform();
          resolve("stopped"); // 녹음 중지
        };

        this.mediaRecorder.start();
        this.visualizeWaveform();
        this.monitorAudio();

        setTimeout(() => {
          if (this.mediaRecorder.state === "recording") {
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
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    const wavBlob = this.audioBufferToWav(audioBuffer); // Blob으로 변환된 WAV 파일
    console.log("WAV Blob:", wavBlob);
    console.log("Is WAV Blob a Blob?:", wavBlob instanceof Blob); // true여야 합니다.
    return wavBlob; // WAV Blob 반환
	}

  audioBufferToWav(buffer) {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2 + 44; // WAV 헤더 크기
    const bufferView = new Uint8Array(length);
    const wavView = new DataView(bufferView.buffer);

    let offset = 0;

    // WAV 파일 헤더
    const writeString = (str) => {
        for (let i = 0; i < str.length; i++) {
            wavView.setUint8(offset + i, str.charCodeAt(i));
        }
        offset += str.length;
    };

    // RIFF 헤더
    writeString('RIFF');
    wavView.setUint32(offset, length - 8, true);
    offset += 4;
    writeString('WAVE');
    writeString('fmt ');
    wavView.setUint32(offset, 16, true); // Subchunk1Size
    wavView.setUint16(offset + 4, 1, true); // AudioFormat
    wavView.setUint16(offset + 6, numOfChannels, true); // NumChannels
    wavView.setUint32(offset + 8, buffer.sampleRate, true); // SampleRate
    wavView.setUint32(offset + 12, buffer.sampleRate * numOfChannels * 2, true); // ByteRate
    wavView.setUint16(offset + 16, numOfChannels * 2, true); // BlockAlign
    wavView.setUint16(offset + 18, 16, true); // BitsPerSample
    writeString('data');
    wavView.setUint32(offset, length - offset - 4, true);
    offset += 4;

    // PCM 데이터
    for (let channel = 0; channel < numOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            wavView.setInt16(offset, intSample, true);
            offset += 2;
        }
    }

    // Blob으로 변환하여 반환
    return new Blob([bufferView], { type: 'audio/wav' });
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

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    cancelAnimationFrame(this.animationFrameId);
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
                this.mediaRecorder.resume(); // 상태가 paused일 때만 resume
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
