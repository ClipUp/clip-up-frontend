import { useEffect, useState } from "react";
import TextInput from '../../ui/textInput/TextInput'
import Button from '../../ui/button/Button'
import { useSignIn } from "../../../hooks/useUser";
import Logo from "../../../assets/clip_up_logo.svg"
import "./signIn.scss";
import { useModalStore, useToastStore } from "../../../store/modalStore";
import SignUp from "./SignUp";

const SignIn = () => {
  const { openModal, closeModal } = useModalStore();
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [disabled, setDisabled] = useState(false);
	const signInMutation = useSignIn();
	const addToast = useToastStore((state) => state.addToast);

	useEffect(() => {
		setDisabled(true);
		if (!confirmInputs({email, password})) return;
		setDisabled(false);
  }, [email, password]);

  const validateEmail = () => {
		const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
		return emailRegex.test(email);
  };
	const confirmEmail = (email) => {
    if (validateEmail(email)) {
      setEmailError("");
			return true;
    } else {
			const inputElement = document.querySelector(".email");
			if (inputElement) {
				inputElement.focus();
			}
      setEmailError("이메일을 입력해주세요.");
			return false;
    }
  }
	const confirmPassword = (password) => {
    if (password && password.length > 1) {
      setPasswordError("");
      return true;
    }
    setPasswordError("비밀번호를 입력해주세요.");
    return false;
		// const hasAlphabet = /[a-zA-Z]/.test(password);
		// const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\\-]/.test(password);

    // if (password.length >= 8 && hasAlphabet && hasSpecialChar) {
    //   setPasswordError("");
		// 	return true;
    // } else {
    //   setPasswordError("비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.");
		// 	return false;
    // }
  };
	const confirmInputs = ({email, password}) => {
		if (!confirmEmail(email)) return false;
		if (!confirmPassword(password)) return false;

		return true;
	}
  const handleSignInError = (status) => {
    if (status === "UNAUTHORIZED") {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else if (status === "NOT_FOUND") {
      setPasswordError("존재하지 않는 사용자입니다.");
    } else {
      return true;
    }
    return false;
  }
	const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleRegist();
    }
  };
	const handleSignIn = async () => {
    return await signInMutation.mutateAsync({email, password});
  };
	const toastSignInResult = (status) => {
		if (status === "OK") {
			addToast("로그인이 완료되었습니다.");
		} else {
			addToast("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
		}
	}
	const handleRegist = async () => {
		if (!confirmInputs({email, password})) return;

		const siginInRes = await handleSignIn();
    if (!handleSignInError(siginInRes.status)) return;
		toastSignInResult(siginInRes.status);
		closeModal();
	}

  return (
    <div className="sign-up-form">
      <img src={Logo} />
      <p>회의록 요약이 필요한 당신을 위한 파트너, 클립업</p>
      <span className="input-group">
        <TextInput
          name="email" placeholder="이메일" type="text" value={email} error={emailError}
          onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown}
        />
        <TextInput
          name="password" placeholder="비밀번호" type="password" value={password} error={passwordError}
          onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}
        />
      </span>
      <Button title="로그인" onClick={handleRegist} disabled={disabled}>
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
