import { useState } from "react";
import TextInput from '../../ui/textInput/TextInput'
import Button from '../../ui/button/Button'
import { useSignIn, useSignUp } from "../../../hooks/useUser";
import "./signIn.scss";
import { useModalStore, useToastStore } from "../../../store/modalStore";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const { closeModal } = useModalStore();
  const signUpMutation = useSignUp();
	const signInMutation = useSignIn();
	const addToast = useToastStore((state) => state.addToast);

  const validateEmail = () => {
	const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
	// setIsValid(emailRegex.test(userEmail));
	return emailRegex.test(email);
  };

  const handleSignUp = async () => {
		return await signUpMutation.mutateAsync({email, password, username})
  };
	const handleSignIn = async () => {
    return await signInMutation.mutateAsync({email, password});
  };

	const confirmEmail = (email) => {
    if (validateEmail(email)) {
      setEmailError("");
    } else {
			const inputElement = document.querySelector(".email");
			if (inputElement) {
				inputElement.focus();
			}
      setEmailError("이메일을 입력해주세요.");
    }
  }
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    confirmEmail(email);
  };
	const confrimRegistedEmail = (status) => {
    if (status === "CONFLICT") {
			const inputElement = document.querySelector(".email");
			if (inputElement) {
				inputElement.focus();
			}
      setEmailError("이미 사용 중인 이메일입니다.");
      return false;
    }
    return true;
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

	const confirmSignIn = (status) => {
		if (status === "OK") {
			addToast("가입이 완료되었습니다. 지금 바로 시작해 보세요!");
		} else {
			addToast("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
		}
	}

	const handleRegist = async () => {
		if (!validateEmail(email)) {
			return confirmEmail();
		} else if (!confirmPasswordSecondary()) {
			return;
		}
		const res = await handleSignUp();
		if (!confrimRegistedEmail(res.status)) {
			return;
		}
		confirmSignIn(await handleSignIn());
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
		<h3>회원가입</h3>
		<span className="input-group">
			<TextInput name="email" placeholder="이메일" type="text" value={email} error={emailError} onChange={(e) => handleEmailInput(e)} onKeyDown={handleKeyDown}></TextInput>
			<TextInput name="username" placeholder="이름" type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKeyDown}></TextInput>
			<TextInput name="password" placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}></TextInput>
			<TextInput name="password2" placeholder="비밀번호 확인" type="password" value={password2} error={passwordError} onChange={(e) => setPassword2(e.target.value)} onKeyDown={handleKeyDown}></TextInput>
	  </span>
		<Button title="가입하기" variant="important" onClick={handleRegist}>
			가입하기
		</Button>
	</div>
  );
};

export default SignUp;