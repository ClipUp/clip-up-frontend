import Button from "../../ui/button/Button";
import SignIn from "../../features/user/SignIn";
import { useModalStore } from "../../../store/modalStore";
import Landing from "../../../assets/img/landing.png"
import "./unauthorized.scss"

const Unauthorized = () => {
	const { openModal } = useModalStore();
	const handleLoginBtn = () => {
		openModal(<SignIn />);
	}

	return (
		<section id="unauthorized_page">
			<div style={{ backgroundImage: `url(${Landing})`, height: window.innerHeight - 84 }}>
				<span className="text">
					<p className="text-s">
						<span>
							회의록 요약이 필요한 당신을 위한 파트너,&nbsp;
						</span>
						<span className="bold">
							클립업
						</span>
					</p>
					<p className="text-xl">
						회의 내용을 놓지지 마세요!<br />
						클립업이 AI로 빠르게 요약해 드립니다
					</p>
				</span>
				<Button
					title="시작하기"
					onClick={handleLoginBtn}
					variant="primary"
				>
					<span>시작하기</span>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M14.43 5.93018L20.5 12.0002L14.43 18.0702" stroke="var(--white)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M3.5 12H20.33" stroke="var(--white)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</Button>
			</div>
		</section>
	);
}

export default Unauthorized;