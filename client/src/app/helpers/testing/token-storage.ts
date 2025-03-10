const ACCESS_KEY = 'jwt-auth-token';
const REFRESH_KEY = 'jwt-refr-token';

interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

function saveTokens() {
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);

  const result: Tokens = { accessToken, refreshToken };

  return result;
}

function restoreTokens(tokens: Tokens) {
  if (tokens.accessToken) {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  } else {
    localStorage.removeItem(ACCESS_KEY);
  }

  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  } else {
    localStorage.removeItem(REFRESH_KEY);
  }
}

export { restoreTokens, saveTokens, Tokens };
