const CategoryItem = ({children, active, onClick}) => {
	return (
		<button
			className={`nav-button ${active ? 'active' : ''}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export default CategoryItem;