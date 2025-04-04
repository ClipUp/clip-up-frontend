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
import { ContextMenu, ProfileContextMenu } from "./components/ui/modal/ContextMenu";
import { useEffect } from "react";
import { useAutoSignIn } from "./hooks/useUser";
import DeletedNoteList from './components/pages/DeletedNoteList';
import Toast from './components/ui/modal/Toast';
import Confirm from './components/ui/modal/Confirm';

const App = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const routeWithAuth = (children) => {
    return accessToken ? children : <Unauthorized />;
  }
  const autoSiginInMutation = useAutoSignIn();
  useEffect(() => {
    const fetchToken = async () => {
      if (!accessToken && localStorage.getItem("RT") !== "N") {
        await autoSiginInMutation.mutateAsync();
      }
    };

    fetchToken();
  }, [accessToken, setAccessToken]);

  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        <SideBar />
        <Main>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/note/list/all" element={<NoteList />}></Route>
            <Route path="/note/list/deleted" element={<DeletedNoteList />}></Route>
            <Route path="/note/:noteId" element={<Note />}></Route>
            <Route path="/note/new" element={<Record />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </Main>
      </div>
      <Footer></Footer>
      <ContextMenu />
      <ProfileContextMenu />
      <Modal />
      <Confirm />
      <Toast />
    </BrowserRouter>
  );
};

export default App;