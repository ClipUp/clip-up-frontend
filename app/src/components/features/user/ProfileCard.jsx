import { useModalStore } from "../../../store/modalStore";
import { useAuthStore } from "../../../store/userStore";
import Button from "../../ui/button/Button";
import ArrowDown from "../../../assets/icon/arrow-down.svg";
import Pen from "../../../assets/icon/pen.svg";
import Logout from "../../../assets/icon/log-out.svg"
import SignIn from "./SignIn";
import "./profileCard.scss";
import { ContextMenuButton, ContextMenuItem } from "../../ui/modal/ContextMenu";
import EditProfile from "./editProfile";
import { useLogout } from "../../../hooks/useUser";

const ProfileCard = () => {
	const userProfile = useAuthStore((state) => state.userProfile);
	const accessToken = useAuthStore((state) => state.accessToken);
	const { openModal } = useModalStore();
	const logoutMutation = useLogout();

	const handleLogout = async () => {
		try {
    	const res = await logoutMutation.mutateAsync();

			if (res.status !== "OK") throw res;
		} catch (e) {
			console.log(e);
			alert("로그아웃에 실패했습니다");
		}
  };

	useLogout
	if (!accessToken || !userProfile) {
		return (
			<Button
				title="로그인"
				onClick={() => {openModal(<SignIn />)}}
			>로그인</Button>
		)
	}
	return (
		<section className="profile-section">
			<div className="user-icon">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M11.999 12.7495C14.894 12.7495 17.249 10.3945 17.249 7.49951C17.249 4.60451 14.894 2.24951 11.999 2.24951C9.10396 2.24951 6.74896 4.60451 6.74896 7.49951C6.74896 10.3945 9.10396 12.7495 11.999 12.7495ZM11.999 3.74951C14.067 3.74951 15.749 5.43151 15.749 7.49951C15.749 9.56751 14.067 11.2495 11.999 11.2495C9.93096 11.2495 8.24896 9.56751 8.24896 7.49951C8.24896 5.43151 9.93096 3.74951 11.999 3.74951ZM19.749 17.9666V18.9775C19.749 19.9125 19.408 20.8085 18.788 21.4995C18.64 21.6655 18.4349 21.7495 18.2289 21.7495C18.0509 21.7495 17.8719 21.6865 17.7289 21.5585C17.4199 21.2825 17.395 20.8085 17.671 20.4995C18.044 20.0825 18.2499 19.5425 18.2499 18.9785V17.9675C18.2499 16.4535 17.2459 15.1435 15.8069 14.7825C15.5539 14.7185 15.282 14.7535 15.061 14.8785C13.16 15.9365 10.8339 15.9325 8.94495 14.8815C8.71895 14.7525 8.44697 14.7155 8.19397 14.7815C6.75497 15.1435 5.74994 16.4535 5.74994 17.9675V18.9785C5.74994 19.5435 5.95598 20.0835 6.32898 20.4995C6.60498 20.8085 6.57894 21.2825 6.27094 21.5585C5.96094 21.8355 5.48698 21.8085 5.21198 21.5005C4.59198 20.8085 4.25098 19.9125 4.25098 18.9785V17.9675C4.25098 15.7655 5.72194 13.8575 7.82794 13.3275C8.45094 13.1695 9.12795 13.2596 9.68195 13.5756C11.1119 14.3716 12.884 14.3745 14.326 13.5725C14.873 13.2605 15.55 13.1715 16.175 13.3285C18.278 13.8555 19.749 15.7636 19.749 17.9666Z" fill="var(--primary-500)"/>
				</svg>
			</div>
			<div className="user-data">
				<span className="username-group">
					<h6 className="username">{userProfile.data.username}</h6>
				<ContextMenuButton id="profileMenu" imageUrl={ArrowDown} menuList={[
          <ContextMenuItem key="edit-profile" title="개인정보 수정" imageUrl={Pen} onClick={() => {openModal(<EditProfile />)}} />,
          <ContextMenuItem key="logout" title="로그아웃" imageUrl={Logout} onClick={handleLogout} />,
        ]}></ContextMenuButton>
				</span>
				<div className="email">{userProfile.data.email}</div>
			</div>
		</section>
	)
}

export default ProfileCard;