import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEMO_ADMIN_EMAIL = 'admin@team10lifts.demo';
export const DEMO_ADMIN_PASSWORD = 'AdminDemo123!';

const DEMO_ADMIN_KEY = 'team10lifts.demoAdminSession';
const listeners = new Set<(isLoggedIn: boolean) => void>();

function notifyListeners(isLoggedIn: boolean) {
  listeners.forEach((listener) => listener(isLoggedIn));
}

export async function getDemoAdminSession() {
  const value = await AsyncStorage.getItem(DEMO_ADMIN_KEY);
  return value === 'true';
}

export async function setDemoAdminSession(isLoggedIn: boolean) {
  if (isLoggedIn) {
    await AsyncStorage.setItem(DEMO_ADMIN_KEY, 'true');
    notifyListeners(true);
    return;
  }

  await AsyncStorage.removeItem(DEMO_ADMIN_KEY);
  notifyListeners(false);
}

export function isDemoAdminCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_ADMIN_EMAIL &&
    password === DEMO_ADMIN_PASSWORD
  );
}

export function subscribeDemoAdminSession(
  listener: (isLoggedIn: boolean) => void
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
