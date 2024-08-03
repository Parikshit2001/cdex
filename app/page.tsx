"use client";
import { useSession } from "next-auth/react";
import Hero from "./components/Hero";

export default function Home() {
  const session = useSession();
  console.log(session);
  return (
    <div>
      <Hero />
    </div>
  );
}
