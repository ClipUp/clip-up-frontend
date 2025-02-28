import { NavLink, useNavigate } from "react-router-dom";

const CategoryItem = ({children, active, onClick, to}) => {
	const navigate = useNavigate();

	const handleClick = (event) => {
			event.preventDefault();
			onClick();
	};

	return (
		<NavLink
			className={`nav-button ${active ? 'active' : ''}`}
			onClick={handleClick}
			to={to}
		>
			{children}
		</NavLink >
	);
}

export default CategoryItem;