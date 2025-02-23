import IconButton from '../ui/button/IconButton';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

	return (
    <header>
      <IconButton title="홈" onClick={()=>{ navigate("/") }}></IconButton>
    </header>
	)
}

export default Header;