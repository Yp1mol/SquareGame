import { loginUser, registerUser } from "../../services/api";

function parseToken(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return {
    token,
    user: {
      id: payload.sub,
      username: payload.username,
    },
  };
}

export async function login(credentials) {
  const response = await loginUser(credentials);
  return parseToken(response.access_token);
}

export async function register(credentials) {
  const response = await registerUser(credentials);
  return parseToken(response.access_token);
}