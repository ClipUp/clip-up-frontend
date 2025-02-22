import { useMutation } from "@tanstack/react-query";
import { userAPI } from "../api/userApi";
import { useAuthStore } from "../store/userStore";

const useSignUp = () => {
  return useMutation({
    mutationFn: (data) => userAPI.createUser(data)
  });
};

const useSignIn = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data) => userAPI.login(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    }
  });
};

const useUpdateUserPwd = () => {
	return useMutation({
		mutationFn: (data) => userAPI.updateUserPwd(data),
	});
}

export {useSignUp, useSignIn, useUpdateUserPwd};