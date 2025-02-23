import { useMutation } from "@tanstack/react-query";
import { userAPI } from "../api/userApi";
import { useAuthStore } from "../store/userStore";

const useSignUp = () => {
  return useMutation({
    mutationFn: (data) => userAPI.register(data)
  });
};

const useSignIn = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (data) => userAPI.login(data),
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
    }
  });
};

const useAutoSignIn = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: () => userAPI.autoLogin(),
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
    },
  });
};

const useUpdateUserPwd = () => {
	const mutation = useMutation({
		mutationFn: (data) => userAPI.updateUserPwd(data),
	});
  return mutation;
}

export {useSignUp, useSignIn, useAutoSignIn, useUpdateUserPwd};