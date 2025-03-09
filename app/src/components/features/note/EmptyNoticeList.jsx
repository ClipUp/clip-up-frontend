import "./emptyNoticeList.scss"

const EmptyNoticeList = ({imageUrl, title, contents, children}) => {
  return (
    <section className="empty-note-list-card">
      {imageUrl && <img src={imageUrl} alt={title} />}
      <div className="text-group">
        {title && <h4>{title}</h4>}
        {contents && <p>{contents}</p>}
      </div>
      {children && children}
    </section>
  );
};

export default EmptyNoticeList;
