import "./noticeCard.scss"

const NoticeCard = ({imageUrl, title, contents, children}) => {
  return (
    <div className="notice-card">
      {imageUrl && <img src={imageUrl} alt="Notice" />}
      <div className="notice-text">
        {title && <h4>{title}</h4>}
        {contents && <p>{contents}</p>}
      </div>
      {children && children}
    </div>
  );
};

export default NoticeCard;
