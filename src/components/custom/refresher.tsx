"use client";
import React, { useCallback, useEffect, useRef } from "react";
import * as jose from "jose";
// making request on the nextnjs server to get the cookie because we cannot req on client because the cookies are http only
const Refresher = ({ children }: { children: React.ReactNode }) => {
  const timeoutId = useRef<NodeJS.Timeout>();
  const getAccessToken = async () => {
    const res = await fetch("/api/auth/accessToken");
    if (!res.ok) {
      return;
    }
    const accessToken = await res.json();
    return accessToken.token;
  };
  const startRefresh = useCallback(async () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return null;
      }

      const token = await jose.decodeJwt(accessToken);
      // convert to milliseconds
      const exp = token.exp! * 1000;
      const currentTime = Date.now();
      const refreshTime = exp - currentTime - 5000;
    //   console.log(`Current Time : ${new Date(currentTime).toISOString()}`);
    //   console.log(`token expiry Time : ${new Date(exp).toISOString()}`);
    //   console.log(
    //     `scheduled refresh Time : ${new Date(
    //       currentTime + refreshTime
    //     ).toISOString()}`
    //   );
      timeoutId.current = setTimeout(() => {
        refreshAccessToken();
        console.log("access token is refreshing");
      }, refreshTime);
    } catch (err: any) {}
  }, []);
  const refreshAccessToken = async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) {
        console.log("failed to refresh access token ");
        return;
      }
    } catch (err: any) {
      console.error("error while refreshing the token", err);
    }
    startRefresh();
  };
  useEffect(() => {
    startRefresh();
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [timeoutId, startRefresh]);
  return <div>{children}</div>;
};

export default Refresher;
