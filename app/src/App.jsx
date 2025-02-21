import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignIn from "./components/user/SignIn";
import SignUp from "./components/user/SignUp";
import AudioRecorder from "./components/audio/audioRecorder";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>로그인</h1>
      <SignIn />
      <h1>가입</h1>
      <SignUp />
      <h1>음성 녹음기</h1>
      <AudioRecorder />
    </QueryClientProvider>
  );
};

export default App;