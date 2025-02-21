import { useState } from "react";
import TextInput from '../common/textInput/TextInput'
import Button from '../common/button/Button'
import { useSignIn } from "../../hooks/useUser";

const SignIn = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const signInMutation = useSignIn();
  // const [isValid, setIsValid] = useState(false);

  const validateEmail = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    // setIsValid(emailRegex.test(userEmail));
    return emailRegex.test(userEmail);
  };

  const handleLogin = async () => {
    signInMutation.mutate({ userEmail, userPwd });
  };

  return (
    <div>
      <TextInput placeholder="이메일" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}></TextInput>
      <TextInput placeholder="비밀번호" value={userPwd} onChange={(e) => setUserPwd(e.target.value)}></TextInput>

      <Button variant="important" onClick={() => {
        if (validateEmail(userEmail)) {
          handleLogin();
        } else {
          alert("이메일 형식 오류");
        }
      }}>로그인하기</Button>
    </div>
  );
};

export default SignIn;
