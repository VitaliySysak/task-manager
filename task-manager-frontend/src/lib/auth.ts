import { VITE_AUTHENTICATED_TOKEN_NAME } from '@/constants/token.constants';

export function isOptimisticallyLoggedIn() {
  return document.cookie.split(';').some(item => item.trim().startsWith(`${VITE_AUTHENTICATED_TOKEN_NAME!}=`));
}
