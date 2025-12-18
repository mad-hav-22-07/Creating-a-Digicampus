import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; // optional, only used if you want expiry checks (see note)

/**
 * Storage keys (keep consistent across the app)
 */
const KEYS = {
  TOKEN: 'userToken',
  ROLE: 'userRole',
  ID: 'userId',
  NAME: 'userName',
};

/**
 * Save token + optional user metadata
 * @param {string} token
 * @param {{ role?: string, id?: string|number, name?: string }} meta
 */
export const setToken = async (token, meta = {}) => {
  try {
    if (token) await AsyncStorage.setItem(KEYS.TOKEN, token);
    if (meta.role) await AsyncStorage.setItem(KEYS.ROLE, meta.role);
    if (meta.id !== undefined && meta.id !== null) await AsyncStorage.setItem(KEYS.ID, String(meta.id));
    if (meta.name) await AsyncStorage.setItem(KEYS.NAME, meta.name);
  } catch (err) {
    console.error('setToken error', err);
    throw err;
  }
};

/**
 * Get stored token (string) or null
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(KEYS.TOKEN);
    return token;
  } catch (err) {
    console.error('getToken error', err);
    return null;
  }
};

/**
 * Remove token and basic user meta (logout)
 */
export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.ROLE, KEYS.ID, KEYS.NAME]);
  } catch (err) {
    console.error('clearAuth error', err);
    throw err;
  }
};

/**
 * Save user meta only
 * @param {{ role?: string, id?: string|number, name?: string }}
 */
export const setUserMeta = async (meta = {}) => {
  try {
    if (meta.role) await AsyncStorage.setItem(KEYS.ROLE, meta.role);
    if (meta.id !== undefined && meta.id !== null) await AsyncStorage.setItem(KEYS.ID, String(meta.id));
    if (meta.name) await AsyncStorage.setItem(KEYS.NAME, meta.name);
  } catch (err) {
    console.error('setUserMeta error', err);
    throw err;
  }
};

/**
 * Get basic user info from storage
 * @returns {Promise<{ role: string|null, id: string|null, name: string|null, token: string|null }>}
 */
export const getCurrentUser = async () => {
  try {
    const [role, id, name, token] = await AsyncStorage.multiGet([
      KEYS.ROLE,
      KEYS.ID,
      KEYS.NAME,
      KEYS.TOKEN,
    ]);
    return {
      role: role[1],
      id: id[1],
      name: name[1],
      token: token[1],
    };
  } catch (err) {
    console.error('getCurrentUser error', err);
    return { role: null, id: null, name: null, token: null };
  }
};

/**
 * Convenient helper: returns { Authorization: 'Bearer ...' } or {}
 */
export const getAuthHeader = async () => {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Role helpers
 */
export const getUserRole = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.ROLE);
  } catch (err) {
    console.error('getUserRole error', err);
    return null;
  }
};

export const isTeacher = async () => (await getUserRole()) === 'teacher';
export const isStudent = async () => (await getUserRole()) === 'student';

/**
 * Optional: check token expiry (requires jwt token and jwt-decode)
 * If you don't want this dependency, remove/ignore this function.
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    /* eslint-disable no-undef */
    const decoded = jwtDecode(token); // install jwt-decode if you want this: npm i jwt-decode
    if (!decoded || !decoded.exp) return false; // can't determine — assume valid
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (err) {
    console.warn('isTokenExpired: failed to decode token', err);
    return false;
  }
};

export default {
  setToken,
  getToken,
  clearAuth,
  setUserMeta,
  getCurrentUser,
  getAuthHeader,
  getUserRole,
  isTeacher,
  isStudent,
  isTokenExpired,
};
