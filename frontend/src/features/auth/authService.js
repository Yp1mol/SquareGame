import { loginUser, registerUser } from "../../services/api";

function parseToken(token, userData) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  
  return {
    token,
    user: {
      id: payload.sub,
      username: payload.username,
      credits: userData?.credits || 0,
    },
  };
}

export async function login(credentials) {
  const response = await loginUser(credentials);

  return parseToken(response.access_token, response.user);
}

export async function register(credentials) {
  await registerUser(credentials);
  const loginResponse = await loginUser(credentials);

  return parseToken(loginResponse.access_token, loginResponse.user);
}