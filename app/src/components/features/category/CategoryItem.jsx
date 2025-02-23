const CategoryItem = ({children, active, onClick}) => {
	return (
		<span
			className={`category-item ${active? "active" : ""}`}
			onClick={onClick}
		>
			{children}
		</span>
	);
}

export default CategoryItem;