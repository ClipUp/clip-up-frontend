import { useMutation } from "@tanstack/react-query";
import { userAPI } from "../api/userApi";
import { useAuthStore } from "../store/userStore";

const useSignUp = () => {
  return useMutation({
    mutationFn: (data) => userAPI.register(data),
    onSuccess: (data) => { return data },
  });
};

const useSignIn = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: async (data) => await userAPI.login(data),
    onSuccess: (data) => {
      if (data.data?.accessToken) {
        setAccessToken(data.data.accessToken);
      }
      return data;
    },
  });
};

const useAutoSignIn = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: () => userAPI.autoLogin(),
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      return true;
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