import type { AppProps } from "next/app";
import { PublicClientApplication, EventType, AccountInfo } from "@azure/msal-browser";
import { createContext, useEffect, useState } from "react";

const msal = new PublicClientApplication({
  auth: {
    clientId: process.env.NEXT_PUBLIC_B2C_CLIENT_ID!,
    authority: process.env.NEXT_PUBLIC_B2C_AUTHORITY!,
    knownAuthorities: [process.env.NEXT_PUBLIC_B2C_KNOWN_AUTHORITIES!],
    redirectUri: process.env.NEXT_PUBLIC_B2C_REDIRECT_URI!,
  },
  cache: { cacheLocation: "localStorage" }
});

export const AuthCtx = createContext<{account?: AccountInfo, idToken?: string, login: () => Promise<void>, logout: () => void}>({
  login: async () => {},
  logout: () => {}
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [account, setAccount] = useState<AccountInfo>();
  const [idToken, setIdToken] = useState<string>();

  useEffect(() => {
    msal.handleRedirectPromise().then((res) => {
      const acc = res?.account ?? msal.getAllAccounts()[0];
      if (acc) {
        msal.setActiveAccount(acc);
        setAccount(acc);
        // @ts-ignore
        setIdToken(res?.idToken ?? (acc?.idToken as string));
      }
    });

    msal.addEventCallback((e) => {
      if (e.eventType === EventType.LOGIN_SUCCESS && e.payload) {
        // @ts-ignore
        const acc = e.payload.account as AccountInfo;
        msal.setActiveAccount(acc);
        setAccount(acc);
      }
    });
  }, []);

  async function login() {
    await msal.loginPopup({ scopes: ["openid", "profile", "offline_access"] });
    const acc = msal.getAllAccounts()[0];
    if (acc) {
      msal.setActiveAccount(acc);
      setAccount(acc);
      // @ts-ignore
      const token = acc.idToken;
      setIdToken(token);
    }
  }

  function logout() {
    msal.logoutPopup();
    setAccount(undefined);
    setIdToken(undefined);
  }

  return (
    <AuthCtx.Provider value={{ account, idToken, login, logout }}>
      <Component {...pageProps} />
    </AuthCtx.Provider>
  );
}
