import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/userStore';
import RecordBtnImg from "../../../assets/img/record_button.webp"
import Button from "../../ui/button/Button"
import "./recordCard.scss"
import { useSpinnerAlertStore, useToastStore } from '../../../store/modalStore';
import { useQueryClient } from '@tanstack/react-query';
import { SpinnerAlert } from '../../ui/modal/ProgressAlert';

const RecordCard = () => {
	const navigate = useNavigate();
	const cancelAPIRef = useRef(null);
	const fileInputRef = useRef(null);
	const accessToken = useAuthStore((state) => state.accessToken);
	const addToast = useToastStore((state) => state.addToast);
	const queryClient = useQueryClient();
	const { showSpinner, closeSpinner } = useSpinnerAlertStore();

	const getAudioFileDuration = (file) => {
		return new Promise((resolve) => {
			const audio = new Audio();
			audio.src = URL.createObjectURL(file);

			audio.onloadedmetadata = () => {
				const audioFileDuration = Math.floor(audio.duration / 60);
				resolve(audioFileDuration); // duration 값을 Promise로 반환
			};
		});
	};
	const handleButtonClick = () => {
		addToast("현재 회의록 생성 서비스를 이용할 수 없습니다.");
    fileInputRef.current.click();
  };
	const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('audioFile', selectedFile);
			formData.append('audioFileDuration', await getAudioFileDuration(selectedFile));

			showSpinner({
				title: "회의록 생성 중",
				confirmText: "닫기",
			}).then((res) => {
				if (res) {
					handleCancel();
					addToast("회의록을 생성하고 있습니다. 잠시만 기다려주세요.");
				}
			});
			cancelAPIRef.current = () => {
				closeSpinner(false);
			};
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://server.clip-up.kr/api/v1/meetings', true);
			xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

      // 프로그레스 이벤트 리스너
      // xhr.upload.onprogress = (event) => { };
      xhr.onload = () => {
        if (xhr.status === 201) {
					queryClient.invalidateQueries(["notes", "recent"]);
					queryClient.invalidateQueries(["notes", "all"]);
          addToast("회의록 생성이 완료되었습니다.");
        } else {
					addToast("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
          console.error('파일 업로드 실패:', xhr.statusText);
        }
				handleCancel();
    		closeSpinner(false);
      };
      xhr.onerror = () => {
				addToast("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        console.error('파일 업로드 중 오류 발생');
				handleCancel();
    		closeSpinner(false);
      };
      xhr.send(formData);
    }
  };
	const handleCancel = () => {
    if (cancelAPIRef.current) {
      cancelAPIRef.current();
    }
  };
	const handleRecordBtn = () => {
		navigate("/note/new");
	}
	return (
		<>
			<section className="create-note-card">
				<div className="create-note-button record">
					<span>
						<h4>클립업과 함께 회의를 시작해보세요</h4>
						<p>녹음만 하면, 회의록이 완성됩니다</p>
					</span>
					<Button title="녹음 시작하기" onClick={handleRecordBtn} variant="primary">녹음 시작하기</Button>
				</div>
				<div className="create-note-button upload">
					<span>
						<h4>파일을 업로드하면 AI가 회의록을 정리해줘요</h4>
						<p>MP3, WAV, M4A 파일 지원</p>
					</span>
					<Button title="파일 업로드" onClick={handleButtonClick}>파일 업로드</Button>
				</div>
				<input
					id="audioFile"
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="audio/mp3, audio/wav, audio/m4a, audio/x-m4a"
					style={{ display: 'none' }}
				/>
			</section>
			<SpinnerAlert />
		</>
	);
}

export default RecordCard;