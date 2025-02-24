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
					await this.saveToServer(audioBlob);
					resolve("stopped"); // 녹음 중지
				};

				this.mediaRecorder.start();
				this.visualizeWaveform();

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