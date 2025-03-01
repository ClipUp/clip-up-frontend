import { useEffect, useState } from "react";
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
	const [originalPasswordError, setOriginalPasswordError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordError2, setPasswordError2] = useState("");
	const [disabled, setDisabled] = useState(false);
	const { closeModal } = useModalStore();
  const updateUserPwdMutation = useUpdateUserPwd();
	const addToast = useToastStore((state) => state.addToast);

	useEffect(() => {
		setDisabled(true);
		if (!confirmInputs({originalPassword, password, password2})) return;
		setDisabled(false);
	}, [originalPassword, password, password2]);

	const confirmOriginalPassword = (originalPassword) => {
		if (originalPassword && originalPassword.length > 0) {
			setOriginalPasswordError("");
			return true;
		}
		setOriginalPasswordError("기존 비밀번호를 입력해주세요.");
		return false;
	}
	const confirmPassword = (password) => {
		const hasAlphabet = /[a-zA-Z]/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\\-]/.test(password);

		if (!password || password.length < 8 || !hasAlphabet || !hasSpecialChar) {
			setPasswordError("비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.");
			return false;
    } else if (password === originalPassword) {
			setPasswordError("기존 비밀번호와 다른 비밀번호를 입력해주세요.");
			return false;
		}
		setPasswordError("");
		return true;
	};
	const confirmPasswordSecondary = (password2) => {
    if (password === password2) {
      setPasswordError2("");
			return true;
    } else {
      setPasswordError2("변경할 비밀번호와 일치하지 않습니다.");
			return false;
    }
  };
	const confirmInputs = ({ originalPassword, password, password2}) => {
		if (!confirmOriginalPassword(originalPassword)) return false;
		if (!confirmPassword(password)) return false;
		if (!confirmPasswordSecondary(password2)) return false;

		return true;
	}

	const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleRegist();
    }
  };
	const handleEditError = (status) => {
    if (status === "UNAUTHORIZED") {
      setOriginalPasswordError("비밀번호가 일치하지 않습니다.");
			return false;
		}
    return true;
  };
	const handleUpdatePwd = async () => {
    return await updateUserPwdMutation.mutateAsync({originalPassword: originalPassword, newPassword: password});
  };
	const toastEditResult = (status) => {
		if (status === "OK") {
			addToast("개인정보 수정이 완료되었습니다.");
		} else {
			addToast("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
		}
	}
	const handleRegist = async () => {
		if (!confirmInputs({originalPassword, password, password2})) return;

		const res = await handleUpdatePwd();
		if (!handleEditError(res.status)) return;
		toastEditResult(res.status);
		closeModal();
	}

  return (
		<div className="sign-up-form">
			<h3>개인 정보 수정</h3>
			<span className="input-group">
				<label htmlFor="email">이메일</label>
				<TextInput name="email" placeholder="이메일" type="text" value={userProfile.data.email} disabled={true}></TextInput>
				<label htmlFor="username">이름</label>
				<TextInput name="username" placeholder="이름" type="text" value={userProfile.data.username} disabled={true}></TextInput>
				<label htmlFor="originPassword">기존 비밀번호</label>
				<TextInput
					name="originPassword" placeholder="기존 비밀번호를 입력해주세요" type="password" value={originalPassword} error={originalPasswordError}
					onChange={(e) => setOriginalPassword(e.target.value)} onKeyDown={handleKeyDown}
				/>
				<label htmlFor="password">비밀번호 변경</label>
				<TextInput
					name="password" placeholder="새 비밀번호를 입력해주세요" type="password" value={password} error={passwordError}
					onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}
				/>
				<label htmlFor="password2">새 비밀번호 확인</label>
				<TextInput
					name="password2" placeholder="새 비밀번호를 한 번 더 입력해주세요" type="password" value={password2} error={passwordError2}
					onChange={(e) => setPassword2(e.target.value)} onKeyDown={handleKeyDown}
				/>			</span>
			<Button title="가입하기" variant="important" onClick={handleRegist} disabled={disabled}>확인</Button>
		</div>
  );
};

export default EditProfile;