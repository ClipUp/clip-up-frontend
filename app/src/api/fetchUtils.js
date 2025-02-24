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
      throw new Error("Unauthorized");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if (!response.ok) {
      if (response.status === 401) {
      throw new Error("Unauthorized");
      }
      throw new Error(`fetchWithAuth() > ${path}: ${response.status}`);
    }
    return response.json();
  }

  return fetchWithAutoRetry(apiCall);
};

export {API_BASE_URL, fetchWithAuth};