"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { PrimaryButton, TabButton } from "./Button";

type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw";
const tabs: { id: Tab; name: string }[] = [
  { id: "tokens", name: "Tokens" },
  { id: "send", name: "Send" },
  { id: "add_funds", name: "Add Funds" },
  { id: "withdraw", name: "Withdraw" },
  { id: "swap", name: "Swap" },
];

export const ProfileCard = ({ publicKey }: { publicKey: string }) => {
  const sesssion = useSession();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<Tab>("tokens");
  console.log({ publicKey });

  if (sesssion.status === "loading") {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!sesssion.data?.user) {
    router.push("/");
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="bg-white shadow-2xl py-5 px-8 rounded-lg w-full max-w-3xl">
        <Greeting
          image={sesssion.data.user.image ?? ""}
          name={sesssion.data.user.name ?? ""}
        />
        <Balance />
        {/* <Assets /> */}
        <div className="flex py-4 w-full">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={tab.id === selectedTab}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.name}
            </TabButton>
          ))}
        </div>
      </div>
    </div>
  );
};

function Greeting({ image, name }: { image: string; name: string }) {
  return (
    <div className="">
      <div className="flex items-center">
        <img
          className="rounded-full w-14 h-14 mr-3"
          src={image}
          alt="User profile Image"
        />
        <h1 className="text-2xl text-gray-700 font-medium">
          Welcome back, {name.split(" ")[0]}!
        </h1>
      </div>
    </div>
  );
}

function Balance() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      let timeout = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  return (
    <div className="flex flex-col mt-6">
      <div>
        <p className="text-sm text-gray-400 font-medium">Tiplink Account Assets</p>
      </div>
      <div className="flex justify-between items-center py-2">
        <h2 className="text-5xl font-bold text-gray-700">${"0.00"} <span className="text-gray-500 text-3xl">USD</span></h2>
        <PrimaryButton
          onClick={() => {
            navigator.clipboard.writeText("0.00");
            setCopied(true);
          }}
        >
          {copied ? "Copied" : "Your Wallet Address"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function Assets() {}
