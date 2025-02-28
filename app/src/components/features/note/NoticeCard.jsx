import "./noticeCard.scss"

const NoticeCard = ({imageUrl, title, contents}) => {
  return (
		<div className="notice-card">
			<img src={imageUrl}/>
			<h4>{title}</h4>
			<p>{contents}</p>
		</div>
  );
};

export default NoticeCard;