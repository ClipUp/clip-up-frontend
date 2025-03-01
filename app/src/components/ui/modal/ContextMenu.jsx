import { useEffect, useRef } from 'react';
import { useContextMenuStore } from '../../../store/modalStore.js';
import "./contextMenu.scss";

const ContextMenuItem = ({ imageUrl, title, onClick }) => {
  const { closeContextMenu } = useContextMenuStore((state) => state);
  const handleClick = () => {
    if (onClick) onClick();
    closeContextMenu();
  }

	return (
		<button title={title} className="context-menu-item" onClick={handleClick}>
			<img src={imageUrl} alt={title}/>
      <span>{title}</span>
		</button>
  );
};

const ContextMenu = () => {
  const { contextMenu, closeContextMenu } = useContextMenuStore((state) => state);
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        closeContextMenu();
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenuRef, closeContextMenu]);

  if (!contextMenu.isOpen || !contextMenu.menuList || contextMenu.menuList.length < 1) return null;

  return (
    <div
      className="context-menu-card"
      ref={contextMenuRef}
      style={{
        position: 'absolute',
        top: contextMenu.position.y,
        left: contextMenu.position.x,
      }}
    >
      <ul>
        {
          contextMenu.menuList.map((menu, idx) => (
            <li key={idx}>
              {menu}
            </li>
          ))
        }
      </ul>
    </div>
  );
};

const ContextMenuButton = ({ id, imageUrl, closeImageUrl, menuList }) => {
  const { openContextMenu, closeContextMenu, contextMenu } = useContextMenuStore((state) => state);

  const handleClick = (e) => {
		e.stopPropagation();

    if (contextMenu.isOpen) {
      return closeContextMenu();
    }
    const buttonRect = e.target.getBoundingClientRect();
    const { top, left, width } = buttonRect;

    openContextMenu(id, left, top + buttonRect.height, menuList);
  };

	return (
		<button title="설정 버튼" className="context-menu-button" onClick={handleClick}>
			<img src={closeImageUrl && contextMenu.isOpen ? closeImageUrl : imageUrl} alt="설정 버튼" />
		</button>
	);
};

export { ContextMenu, ContextMenuButton, ContextMenuItem };