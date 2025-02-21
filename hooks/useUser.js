import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../api/userApi";

// 사용자 정보 가져오기
export const useUser = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userAPI.login(userId),
  });
};

// 사용자 생성 (mutate 사용)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
