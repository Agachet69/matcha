import { getAuthorizedInstance } from "../utils/Instance";

export const addLike = (user_id, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = getAuthorizedInstance(token.access_token);
      const data = await instance.post(`/users/like/${user_id}`);
      resolve(data);
    } catch (err) {
      return reject(err);
    }
  });
};
