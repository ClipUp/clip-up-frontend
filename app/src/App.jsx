import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from "./components/layout/Main";
import Header from "./components/layout/Header";
import SideBar from "./components/layout/SideBar";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/error/NotFound";
import Note from "./components/pages/Note";
import NoteList from "./components/pages/NoteList";
import { useAuthStore } from "./store/userStore";
import Unauthorized from "./components/pages/error/Unauthorized";
import Record from "./components/pages/Record";
import Modal from "./components/ui/modal/Modal";
import { useEffect } from "react";
import { useAutoSignIn } from "./hooks/useUser";

const App = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const routeWithAuth = (children) => {
    return accessToken ? children : <Unauthorized />;
  }
  const autoSiginInMutation = useAutoSignIn();
  useEffect(() => {
    const fetchToken = async () => {
      if (!accessToken && sessionStorage.getItem("RT") !== "N") {
        if (!await autoSiginInMutation.mutateAsync()) {
          sessionStorage.setItem("RT", "N");
        } else {
          sessionStorage.setItem("RT", "Y");
        }
      }
    };

    fetchToken();
  }, [accessToken, setAccessToken]);

  return (
    <BrowserRouter>
      <Header />
      <Main>
        <SideBar />
          <Routes>
            <Route path="/" element={routeWithAuth(<Home />)}></Route>
            <Route path="/note/list/:isDeleted" element={routeWithAuth(<NoteList />)}></Route>
            <Route path="/note/:noteState" element={routeWithAuth(<Note />)}></Route>
            <Route path="/note/new" element={routeWithAuth(<Record />)}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
      </Main>
      <Footer></Footer>
      <Modal></Modal>
    </BrowserRouter>
  );
};

export default App;