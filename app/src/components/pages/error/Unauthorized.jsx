import Button from "../../ui/button/Button";
import SignIn from "../../features/user/SignIn";
import SignUp from "../../features/user/SignUp";
import { useModalStore } from "../../../store/modalStore";

const Unauthorized = () => {
	const { openModal } = useModalStore();
	const handleLoginBtn = () => {
		openModal(<>
			<SignIn />
			<Button title="가입" variant="important" onClick={() => {}}>
				가입
			</Button>
		</>);
	}

	return (
		<>
			<section>
				<p>
					회의 내용을 놓지지 마세요!<br />
					클립업이 AI로 빠르게 요약해 드립니다
				</p>
				<Button
					title="로그인/회원가입"
					onClick={handleLoginBtn}
				>로그인/회원가입</Button>
			</section>
		</>
	);
}

export default Unauthorized;