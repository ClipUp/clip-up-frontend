import { useState } from "react";
import CategoryItem from "./CategoryItem";
import { useAuthStore } from "../../../store/userStore";
import { useNavigate } from "react-router-dom";
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
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY); // 기본 선택값 설정
  const accessToken = useAuthStore((state) => state.accessToken);
  const { openModal } = useModalStore();
  const handleClickCategory = async (idx) => {
    if (accessToken || idx === DEFAULT_CATEGORY) {
      navigate(CATEGORIES[idx].path);
      return setActiveCategory(idx)
    }
    openModal(<SignIn />);
  }

  return (
    <nav>
      <ul>
        {CATEGORIES.map((category, idx) => (
          <li key={idx}>
            <CategoryItem
              linkTo={category.path}
              active={activeCategory === idx}
              onClick={() => handleClickCategory(idx)}
            >
              <img src={category.icon[activeCategory === idx ? 1 : 0]}/>
              <span>{category.title}</span>
            </CategoryItem>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryList;