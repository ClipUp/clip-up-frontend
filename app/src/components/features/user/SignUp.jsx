import { useState } from "react";
import TextInput from '../../ui/textInput/TextInput'
import Button from '../../ui/button/Button'
import { useSignUp } from "../../../hooks/useUser";
import "./SignUp.scss";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [isValid, setIsValid] = useState(false);
  const signUpMutation = useSignUp();

  const validateEmail = () => {
	const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
	// setIsValid(emailRegex.test(userEmail));
	return emailRegex.test(email);
  };

  const handleSignUp = async () => {
	await signUpMutation.mutate({email, password, username})
  };

  return (
	<div className="sign-up-form">
	  <TextInput placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)}></TextInput>
	  <TextInput placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}></TextInput>
	  <TextInput placeholder="이름" value={username} onChange={(e) => setUsername(e.target.value)}></TextInput>
	  <Button title="가입하기" variant="important" onClick={() => {
			if (validateEmail(email)) {
				handleSignUp();
			} else {
				alert("이메일 형식 오류");
			}
			}}>가입하기
		</Button>
	</div>
  );
};

export default SignUp;