'use server';

import { commonsPlatform, LOCAL_BASE_URL, base_url as hostUrl } from '@/app/lib/helpers/utils';
import get from '@/app/lib/data/get';

export async function loginUser(email: string, password: string, originalUrl: string, is_trusted: boolean = false) {
  const url = `${LOCAL_BASE_URL}/api/auth/login`;

  const body = {
    username: email,
    password,
    originalUrl,
    is_trusted,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  
  return data;
}

export async function resetPassword(email: string) {
  const url = `${LOCAL_BASE_URL}/api/auth/forgot-password`;

  const data = await get({
    url,
    method: 'POST',
    body: { email },
  });

  return data;
}

export async function updatePassword(newPassword: string, confirmPassword: string, token: string) {
  const url = `${LOCAL_BASE_URL}/api/auth/reset-password`;

  const body = {
    password: newPassword,
    confirmPassword,
    token,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });

  return data;
}

export async function validateToken(token: string) {
  const url = `${LOCAL_BASE_URL}/api/auth/validate-token`;
  
  const data = await get({
    url,
    method: "POST",
    body: { token },
  });
  return data;
}

export async function initiateSSO(originalUrl: string) {
  try {
    const base_url: string | undefined = commonsPlatform.find(
      (p: any) => p.key === "login"
    )?.url;
  
    if (!base_url) {
      throw new Error("Platform base URL not found.");
    }

    const url = `${base_url}/sso-inits?is_api_call=true&host_redirect_url=${encodeURIComponent(originalUrl)}&host_redirect_failed_auth_url=${encodeURIComponent(hostUrl)}/login`;
    const data = await get({
      url,
      method: 'GET',
    });

    return data;
  } catch (error) {
    console.error('Error initiating SSO:', error);
    throw error;
  }
}
