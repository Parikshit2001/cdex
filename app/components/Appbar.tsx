"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { PrimaryButton } from "./Button";

function Appbar() {
  const session = useSession();
  return (
    <div className="flex justify-between items-center px-2 py-2 border-b">
      <div>
        <h1 className="text-xl font-bold">CDEX</h1>
      </div>
      <div>
        {session.data?.user ? (
          <PrimaryButton
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={() => {
              signIn();
            }}
          >
            Login
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

export default Appbar;
