import { useState } from "react";
import CategoryItem from "./CategoryItem";
import { useAuthStore } from "../../../store/userStore";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../../../store/modalStore";
import SignIn from "../user/SignIn";
import Button from "../../ui/button/Button";
import SignUp from "../user/SignUp";
import Home from '../../../assets/icon/home.svg';
import Archive from '../../../assets/icon/archive.svg';
import Trash from '../../../assets/icon/trash.svg';
import "./categoryList.scss";

const DEFAULT_CATEGORY = 0;
const CATEGORIES = [
  {title:"홈", path:"/", icon: Home},
  {title:"회의록", path:"/note/list/all", icon: Archive},
  {title:"휴지통", path:"/note/list/deleted", icon: Trash}
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
    if (await confirm("로그인 하시겠습니까?")) {
      openModal(<>
        <SignIn />
        <Button title="가입" variant="important" onClick={() => {openModal(<SignUp />)}}>
          가입
        </Button>
      </>);
    }
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
              <img src={category.icon}/>
              <span>{category.title}</span>
            </CategoryItem>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryList;