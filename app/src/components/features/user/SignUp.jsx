import { useEffect, useState } from "react";
import TextInput from '../../ui/textInput/TextInput'
import Button from '../../ui/button/Button'
import { useSignIn, useSignUp } from "../../../hooks/useUser";
import "./signIn.scss";
import { useModalStore, useToastStore } from "../../../store/modalStore";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordError2, setPasswordError2] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [isComposing, setIsComposing] = useState(false);
	const { closeModal } = useModalStore();
  const signUpMutation = useSignUp();
	const signInMutation = useSignIn();
	const addToast = useToastStore((state) => state.addToast);

	useEffect(() => {
		if (email === "" || username === "" || password === "" || password2 === "") {
      setDisabled(true);
      return;
    }
		setDisabled(!confirmInputs({email, username, password, password2}));
  }, [email, username, password, password2]);

  const validateEmail = () => {
		const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
		return emailRegex.test(email);
  };
	const confirmEmail = (email) => {
    if (validateEmail(email)) {
      setEmailError("");
			return true;
    } else {
      setEmailError("이메일을 입력해주세요.");
			return false;
    }
  }
	const confirmUsername = (username) => {
		if (username && username.length > 0) {
			setUsernameError("");
			return true;
		}
		setUsernameError("이름을 입력해주세요.");
		return false;
	}
	const confirmPassword = (password) => {
		const hasSpecialChar = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

		if (password.length < 8) {
			setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
			return false;
		} else if (!hasSpecialChar) {
			setPasswordError("비밀번호는 영문, 숫자, 특수문자(@$!%*?&)를 포함해야 합니다.");
			return false;
    } else {
			setPasswordError("");
			return true;
		}
  };
	const confirmPasswordSecondary = (password2) => {
    if (password === password2) {
      setPasswordError2("");
			return true;
    } else {
      setPasswordError2("비밀번호가 일치하지 않습니다.");
			return false;
    }
  };
	const confirmInputs = ({email, username, password, password2}) => {
		if (!confirmEmail(email)) return false;
		if (!confirmUsername(username)) return false;
		if (!confirmPassword(password)) return false;
		if (!confirmPasswordSecondary(password2)) return false;

		return true;
	}
	const handleKeyDown = (event) => {
    if (event.key === "Enter" && !disabled && !isComposing) {
      event.preventDefault();
      handleRegist();
    }
  };
	const handleSignUp = async () => {
		return await signUpMutation.mutateAsync({email, password, username})
  };
	const handleSignIn = async () => {
    return await signInMutation.mutateAsync({email, password});
  };
	const handleSignUpError = (status) => {
    if (status === "CONFLICT") {
      setEmailError("이미 사용 중인 이메일입니다.");
      return false;
    }
    return true;
  };
	const toastSignInResult = (status) => {
		if (status === "OK") {
			addToast("가입이 완료되었습니다. 지금 바로 시작해 보세요!");
		} else if (status === "BAD_REQUEST") {
			addToast("비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.");
		} else {
			addToast("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
		}
	}
	const handleRegist = async () => {
		if (!confirmInputs({email, username, password, password2})) return;

		const res = await handleSignUp();
		if (!handleSignUpError(res.status)) return;

		const siginInRes = await handleSignIn();
		toastSignInResult(siginInRes.status);
		closeModal();
	}

  return (
	<div className="sign-up-form">
		<h3>회원가입</h3>
		<span className="input-group">
			<TextInput
				name="email" placeholder="이메일" type="text" value={email} error={emailError}
				onChange={(e) => setEmail(e.target.value)}
				onKeyDown={handleKeyDown}
				onCompositionStart={() => setIsComposing(true)}
				onCompositionEnd={() => setIsComposing(false)}
			/>
			<TextInput
				name="username" placeholder="이름" type="text" value={username} error={usernameError}
				onChange={(e) => setUsername(e.target.value)}
				onKeyDown={handleKeyDown}
				onCompositionStart={() => setIsComposing(true)}
				onCompositionEnd={() => setIsComposing(false)}
			/>
			<TextInput
				name="password" placeholder="비밀번호" type="password" value={password} error={passwordError}
				onChange={(e) => setPassword(e.target.value)}
				onKeyDown={handleKeyDown}
				onCompositionStart={() => setIsComposing(true)}
				onCompositionEnd={() => setIsComposing(false)}
			/>
			<TextInput
				name="password2" placeholder="비밀번호 확인" type="password" value={password2} error={passwordError2}
				onChange={(e) => setPassword2(e.target.value)}
				onKeyDown={handleKeyDown}
				onCompositionStart={() => setIsComposing(true)}
				onCompositionEnd={() => setIsComposing(false)}
			/>
	  </span>
		<Button title="가입하기" variant="important" onClick={handleRegist} disabled={disabled}>
			가입하기
		</Button>
	</div>
  );
};

export default SignUp;