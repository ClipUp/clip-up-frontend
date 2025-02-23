import { useState } from "react";
import TextInput from '../../ui/textInput/TextInput'
import Button from '../../ui/button/Button'
import { useSignIn } from "../../../hooks/useUser";
import "./SignUp.scss";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signInMutation = useSignIn();
  // const [isValid, setIsValid] = useState(false);

  const validateEmail = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    // setIsValid(emailRegex.test(userEmail));
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    await signInMutation.mutate({email, password});
  };

  return (
    <div className="sign-up-form">
      <TextInput placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)}></TextInput>
      <TextInput placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}></TextInput>

      <Button title="로그인" variant="important" onClick={() => {
        if (validateEmail(email)) {
          handleSignIn();
        } else {
          alert("이메일 형식 오류");
        }
      }}>
        로그인
      </Button>
    </div>
  );
};

export default SignIn;
