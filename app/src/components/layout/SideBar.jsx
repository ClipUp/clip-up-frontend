import CategoryList from '../features/category/CategoryList';
import ProfileCard from '../features/user/ProfileCard';
import Line from '../ui/Line/Line';

const SideBar = () => {
	return (
		<aside>
			<ProfileCard></ProfileCard>
			<Line/>
			<CategoryList></CategoryList>
		</aside>
	)
}

export default SideBar;