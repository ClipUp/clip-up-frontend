import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/userStore";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useModalStore } from "../../../store/modalStore";
import SignIn from "../user/SignIn";
import Home from '../../../assets/icon/home.svg';
import Archive from '../../../assets/icon/archive.svg';
import Trash from '../../../assets/icon/trash.svg';
import HomeActive from '../../../assets/icon/home-active.svg';
import ArchiveActive from '../../../assets/icon/archive-active.svg';
import TrashActive from '../../../assets/icon/trash-active.svg';
import "./categoryList.scss";

const DEFAULT_CATEGORY = 0;
const CATEGORIES = [
  {title:"홈", path:"/", icon: [Home, HomeActive]},
  {title:"회의록", path:"/note/list/all", icon: [Archive, ArchiveActive]},
  {title:"휴지통", path:"/note/list/deleted", icon: [Trash, TrashActive]}
];
const CategoryList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY); // 기본 선택값 설정
  const accessToken = useAuthStore((state) => state.accessToken);
  const { openModal } = useModalStore();

  useEffect(() => {
    const currentIdx = CATEGORIES.findIndex(category => category.path === location.pathname);
    if (currentIdx !== -1) {
      setActiveCategory(currentIdx);
    }
  }, [location.pathname]);

  const handleClickCategory = async (event, idx) => {
    event.preventDefault();
    if (accessToken || idx === DEFAULT_CATEGORY) {
      navigate(CATEGORIES[idx].path);
      return setActiveCategory(idx)
    }
    openModal(<SignIn />);
    return location.pathname;
  }

  return (
    <nav>
      <ul>
        {CATEGORIES.map((category, idx) => (
          <li key={idx}>
            <NavLink
              to={category.path}
              className={`nav-button ${activeCategory === idx ? 'active' : ''}`}
              onClick={(e) => handleClickCategory(e, idx)}
            >
              <img src={category.icon[activeCategory === idx ? 1 : 0]}/>
              <span>{category.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryList;