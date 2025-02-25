import { useModalStore } from "../../../store/modalStore";
import { useAuthStore } from "../../../store/userStore";
import Button from "../../ui/button/Button";
import IconButton from "../../ui/button/IconButton";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const ProfileCard = () => {
	const accessToken = useAuthStore((state) => state.accessToken);
	const { openModal } = useModalStore();

	if (!accessToken) {
		return (
			<Button
				title="로그인"
				onClick={() => {openModal(<>
					<SignIn />
					<Button title="가입" variant="important" onClick={() => {openModal(<SignUp />)}}>
						가입
					</Button>
				</>);}}
			>로그인</Button>
		)
	}
	return (
		<section>
			<span>사용자 프로필</span>
			<IconButton title="더보기"></IconButton>
		</section>
	)
}

export default ProfileCard;