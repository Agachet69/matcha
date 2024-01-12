import { getAuthorizedInstance } from "../utils/Instance";

export const addLike = async (user_id, token) => {
  try {
    const instance = getAuthorizedInstance(token.access_token);
    return await instance.post(`/users/like/${user_id}`, {});
  } catch (err) {
    return err;
  }
};
