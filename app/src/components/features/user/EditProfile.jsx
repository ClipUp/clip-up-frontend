import { useState } from "react";
import TextInput from '../../ui/textInput/TextInput'
import Button from '../../ui/button/Button'
import { useUpdateUserPwd } from "../../../hooks/useUser";
import "./signIn.scss";
import { useModalStore, useToastStore } from "../../../store/modalStore";
import { useAuthStore } from "../../../store/userStore";

const EditProfile = () => {
	const userProfile = useAuthStore((state) => state.userProfile);
	const [originalPassword, setOriginalPassword] = useState("");
  const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const { closeModal } = useModalStore();
  const updateUserPwdMutation = useUpdateUserPwd();
	const addToast = useToastStore((state) => state.addToast);

	const handleUpdatePwd = async () => {
    return await updateUserPwdMutation.mutateAsync({originalPassword: originalPassword, newPassword: password});
  };

	const confirmPasswordSecondary = () => {
    if (password === password2) {
      setPasswordError("");
			return true;
    } else {
			const inputElement = document.querySelector(".password");
			if (inputElement) {
				inputElement.focus();
			}
      setPasswordError("비밀번호가 일치하지 않습니다.");
			return false;
    }
  };
	const confirmEdit = (status) => {
		if (status === "OK") {
			addToast("개인정보 수정이 완료되었습니다.");
		} else {
			addToast("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
		}
	}
	const handleRegist = async () => {
		if (!confirmPasswordSecondary()) {
			return;
		}
		confirmEdit(await handleUpdatePwd());
		closeModal();
	}
	const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleRegist();
    }
  };

  return (
		<div className="sign-up-form">
			<h3>개인 정보 수정</h3>
			<span className="input-group">
				<label htmlFor="email">이메일</label>
				<TextInput name="email" placeholder="이메일" type="text" value={userProfile.data.email} disabled={true}></TextInput>
				<label htmlFor="username">이름</label>
				<TextInput name="username" placeholder="이름" type="text" value={userProfile.data.username} disabled={true}></TextInput>
				<label htmlFor="password">기존 비밀번호</label>
				<TextInput name="password" placeholder="기존 비밀번호를 입력해주세요" type="password" value={originalPassword} onChange={(e) => setOriginalPassword(e.target.value)} onKeyDown={handleKeyDown}></TextInput>
				<label htmlFor="password">비밀번호 변경</label>
				<TextInput name="password" placeholder="새 비밀번호를 입력해주세요" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}></TextInput>
				<label htmlFor="password2">새 비밀번호 확인</label>
				<TextInput name="password2" placeholder="새 비밀번호를 한 번 더 입력해주세요" type="password" value={password2} error={passwordError} onChange={(e) => setPassword2(e.target.value)} onKeyDown={handleKeyDown}></TextInput>
			</span>
			<Button title="가입하기" variant="important" onClick={handleRegist}>가입하기</Button>
		</div>
  );
};

export default EditProfile;