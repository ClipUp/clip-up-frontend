import { useState } from "react";
import TextInput from '../../ui/textInput/TextInput'
import Button from '../../ui/button/Button'
import { useSignIn, useSignUp } from "../../../hooks/useUser";
import "./SignUp.scss";
import { useModalStore } from "../../../store/modalStore";

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
      setEmailError("이메일을 입력해주세요.");
    }
  }
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    confirmEmail(email);
  };
	const confrimRegistedEmail = (status) => {
    if (status === "CONFLICT") {
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
      setPasswordError("비밀번호가 일치하지 않습니다.");
			return false;
    }
  };

  return (
	<div className="sign-up-form">
		<h3>회원가입</h3>
		<span className="input-group">
			<TextInput placeholder="이메일" type="text" value={email} error={emailError} onChange={(e) => handleEmailInput(e)}></TextInput>
			<TextInput placeholder="이름" type="text" value={username} onChange={(e) => setUsername(e.target.value)}></TextInput>
			<TextInput placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></TextInput>
			<TextInput placeholder="비밀번호 확인" type="password" value={password2} error={passwordError} onChange={(e) => setPassword2(e.target.value)}></TextInput>
	  </span>
		<Button title="가입하기" variant="important" onClick={async () => {
			if (!validateEmail(email)) {
				return confirmEmail();
			} else if (!confirmPasswordSecondary()) {
				return;
			}
			const res = await handleSignUp();
			if (!confrimRegistedEmail(res.status)) {
				return;
			}
			await handleSignIn()
			closeModal();
		}}>가입하기
		</Button>
	</div>
  );
};

export default SignUp;