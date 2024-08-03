"use client";
import { SessionProvider } from "next-auth/react";

export const Proivders = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
