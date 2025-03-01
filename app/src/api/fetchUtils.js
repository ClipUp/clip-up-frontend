import { useAuthStore } from "../store/userStore";

const API_BASE_URL = "https://server.clip-up.kr";
const MAX_RETRY_CNT = 1;

const fetchWithAutoRetry = async (apiCall) => {
  let retryCnt = 0;

  try {
    return await apiCall();
  } catch (error) { //재시도
    if (error.message === "Unauthorized" && retryCnt < MAX_RETRY_CNT) {
      try {
        retryCnt++;
        // await autoLogin(); // 자동 로그인
        return await apiCall();
      } catch (e) {
        console.log(e.message);
      }
    }
    throw error;
  }
};

const fetchWithAuth = async (path, options) => {
	const accessToken = useAuthStore.getState().accessToken;
  const apiCall = async () => {
    if (!accessToken) {
      return ({status: "UNAUTHORIZED", message: "인증에 실패하였습니다."});
    }

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

      return res.json();
    } catch (e) {
      return e;
    }
  }

  return await fetchWithAutoRetry(apiCall);
};

export {API_BASE_URL, fetchWithAuth};