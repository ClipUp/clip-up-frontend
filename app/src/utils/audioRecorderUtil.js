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
					this.onStopRecording(audioBlob);
					this.stopVisualizeWaveform();
					// await this.saveToServer(audioBlob);
					resolve("stopped"); // 녹음 중지
				};

				this.mediaRecorder.start();
				this.visualizeWaveform();
				this.monitorAudio();

				setTimeout(() => {
					if (this.mediaRecorder.state === "recording") {
						this.mediaRecorder.stop();
						// this.startRecording(); // 새 파일 시작
						resolve("max"); // 녹음 자동 종료
					}
				}, this.maxDuration);
			});
		} catch (error) {
			console.error("음성 녹음 시작 실패:", error);
			throw error;
		}
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
            if (!this.isRecording) {
                this.mediaRecorder.resume();
                this.isRecording = true;
            }
        }
    }, 100);
	}

	getVolume() {
		return this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
	}

	async saveToServer(audioBlob) {
	  const formData = new FormData();
	  formData.append("audio", audioBlob, "recording.webm");

	  try {
		const response = await fetch("/api/save", {
		  method: "POST",
		  body: formData,
		});
		if (!response.ok) throw new Error("서버 저장 실패");
		console.log("서버 저장 성공");
	  } catch (error) {
		console.error("파일 업로드 실패:", error);
	  }
	}
}

  export default AudioRecorder;