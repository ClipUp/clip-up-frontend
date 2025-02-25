import IconButton from '../ui/button/IconButton';
import { useNavigate } from 'react-router-dom';
import ClipUpLogo from '../../assets/clip_up_logo2.svg';

const Header = () => {
  const navigate = useNavigate();

	return (
    <header>
      <IconButton title="홈" onClick={()=>{ navigate("/") }}>
        <img src={ClipUpLogo} alt="Clip Up" />
      </IconButton>
    </header>
	)
}

export default Header;