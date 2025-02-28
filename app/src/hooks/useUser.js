import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  return useMutation({
    mutationFn: async (data) => await userAPI.login(data),
    onSuccess: async (data) => {
      if (data.data?.accessToken) {
        setAccessToken(data.data.accessToken);
        setUserProfile(await userAPI.getUser());
        sessionStorage.setItem("RT", "Y");
      }
      return data;
    },
  });
};

const useAutoSignIn = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  return useMutation({
    mutationFn: () => userAPI.autoLogin(),
    onSuccess: async (data) => {
      try {
        if (data.data?.accessToken) {
          setAccessToken(data.data.accessToken);
          setUserProfile(await userAPI.getUser());
          sessionStorage.setItem("RT", "Y");
        }
        return data;
      } catch(e) {
        console.log(e);
        return false;
      }
    },
  });
};

const useLogout = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  return useMutation({
    mutationFn: () => userAPI.logout(),
    onSuccess: async (data) => {
      try {
        if (data.status === "OK") {
          setAccessToken(null);
          setUserProfile(null);
          sessionStorage.setItem("RT", "N");
        }
        return data;
      } catch(e) {
        console.log(e);
        return false;
      }
    },
  });
};

const useUser = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['user', accessToken],
    queryFn: () => userAPI.getUser(),
    select: (response) => response.data,
  });
};

const useUpdateUserPwd = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

	const mutation = useMutation({
		mutationFn: (data) => userAPI.updateUserPwd(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', accessToken]);
    },
	});
  return mutation;
};

export {useSignUp, useSignIn, useAutoSignIn, useLogout, useUser, useUpdateUserPwd};