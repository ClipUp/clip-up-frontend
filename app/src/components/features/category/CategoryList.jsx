import { useState } from "react";
import CategoryItem from "./CategoryItem";
import { useAuthStore } from "../../../store/userStore";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../../../store/modalStore";
import SignIn from "../user/SignIn";
import Button from "../../ui/button/Button";

const DEFAULT_CATEGORY = 0;
const CATEGORIES = [
  {title:"홈", path:"/"},
  {title:"회의록", path:"/note/list/all"},
  {title:"휴지통", path:"/note/list/deleted"}
];
const CategoryList = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[DEFAULT_CATEGORY]); // 기본 선택값 설정
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
        <Button title="가입" variant="important" onClick={() => {}}>
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
                {category.title}
            </CategoryItem>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryList;