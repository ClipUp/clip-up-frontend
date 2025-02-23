import CategoryList from '../features/category/CategoryList';
import ProfileCard from '../features/user/ProfileCard';

const SideBar = () => {
	return (
		<aside>
			<ProfileCard></ProfileCard>
			<CategoryList></CategoryList>
		</aside>
	)
}

export default SideBar;