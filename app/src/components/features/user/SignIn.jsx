import { useState } from "react";
import TextInput from '../../ui/textInput/TextInput'
import Button from '../../ui/button/Button'
import { useSignIn } from "../../../hooks/useUser";
import Logo from "../../../assets/clip_up_logo.svg"
import "./signIn.scss";
import { useModalStore } from "../../../store/modalStore";
import SignUp from "./SignUp";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const signInMutation = useSignIn();
  const { openModal, closeModal } = useModalStore();

  const validateEmail = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
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
  const handleEmailInput = async (e) => {
    setEmail(e.target.value);
    confirmEmail(email);
  };

  const confrimPassword = (status) => {
    if (status === "OK") {
      setPasswordError("");
      return true;
    }
    const inputElement = document.querySelector(".password");
    if (inputElement) {
      inputElement.focus();
    }
    if (status === "UNAUTHORIZED") {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else if (status === "NOT_FOUND") {
      setPasswordError("존재하지 않는 사용자입니다.");
    }
    return false;
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      confirmEmail();
    }
    const res = await handleSignIn();

    if (!confrimPassword(res.status)) {
      return;
    } else {
      closeModal();
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="sign-up-form">
      <img src={Logo} />
      <p>회의록 요약이 필요한 당신을 위한 파트너, 클립업</p>
      <span className="input-group">
        <TextInput className="email" placeholder="이메일" type="text" value={email} error={emailError} onChange={(e) => handleEmailInput(e)} onKeyDown={handleKeyDown}></TextInput>
        <TextInput className="password" placeholder="비밀번호" type="password" value={password} error={passwordError} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}></TextInput>
      </span>
      <Button title="로그인" onClick={handleLogin}>
        로그인
      </Button>
      <Button title="회원가입" variant="primary-light" onClick={() => {openModal(<SignUp />)}}>
        회원가입
      </Button>
      <p className="hint">
        로그인은 개인 정보 보호 정책 및 서비스 약관에 동의하는 것을 의미하며, 서비스 이용을 위해 이메일과 이름, 프로필 이미지를 수집합니다.
      </p>
    </div>
  );
};

export default SignIn;
