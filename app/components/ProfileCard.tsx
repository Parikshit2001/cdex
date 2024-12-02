"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { PrimaryButton, TabButton } from "./Button";
import { TokenWithbalance, useTokens } from "../hooks/useToken";
import { TokenList } from "./TokenList";
import { Swap } from "./Swap";
import Image from "next/image";

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
  const { tokenBalances, loading } = useTokens(publicKey);
  console.log(tokenBalances);

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
    <div className="w-full h-screen pt-28">
      <div className="bg-white shadow-2xl py-5 px-8 rounded-lg w-full max-w-3xl mx-auto">
        <Greeting
          image={sesssion.data.user.image ?? ""}
          name={sesssion.data.user.name ?? ""}
        />
        <Balance
          balance={tokenBalances?.totalBalance as number}
          publicKey={publicKey}
          loading={loading}
        />
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
        <div className={`${selectedTab === "tokens" ? "visible" : "hidden"}`}>
          <Assets loading={loading} tokenBalances={tokenBalances} />
        </div>
        <div className={`${selectedTab === "swap" ? "visible" : "hidden"}`}>
          <Swap publicKey={publicKey} tokenBalances={tokenBalances} />
        </div>
        <div
          className={`${
            selectedTab !== "tokens" && selectedTab !== "swap"
              ? "visible"
              : "hidden"
          }`}
        >
          <Warning />
        </div>
      </div>
    </div>
  );
};

function Warning() {
  return (
    <div className="text-center py-10">We do not support this feature yet</div>
  );
}

function Assets({
  tokenBalances,
  loading,
}: {
  tokenBalances: {
    totalBalance: number;
    tokens: TokenWithbalance[];
  } | null;
  loading: boolean;
}) {
  if (loading) {
    return "Loading...";
  }

  return (
    <div className="flex flex-col">
      <div>
        <p className="text-sm text-gray-400 font-medium">CDEX Account Assets</p>
      </div>
      <div className="border mb-4" />
      <div>
        <TokenList tokens={tokenBalances?.tokens as TokenWithbalance[]} />
      </div>
    </div>
  );
}

function Greeting({ image, name }: { image: string; name: string }) {
  return (
    <div className="">
      <div className="flex items-center">
        <Image
          className="rounded-full w-14 h-14 mr-3"
          src={image}
          width={100}
          height={100}
          alt="User profile Image"
        />
        <h1 className="text-2xl text-gray-700 font-medium">
          Welcome back, {name.split(" ")[0]}!
        </h1>
      </div>
    </div>
  );
}
function Balance({
  publicKey,
  balance,
  loading,
}: {
  publicKey: string;
  balance: number;
  loading: boolean;
}) {
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
        <p className="text-sm text-gray-400 font-medium">
          CDEX Account Balance
        </p>
      </div>
      <div className="flex justify-between items-center py-2">
        <h2 className="text-5xl font-bold text-gray-700">
          ${loading ? "..." : balance}{" "}
          <span className="text-gray-500 text-3xl">USD</span>
        </h2>
        <PrimaryButton
          onClick={() => {
            navigator.clipboard.writeText(publicKey);
            setCopied(true);
          }}
        >
          {copied ? "Copied" : "Your Wallet Address"}
        </PrimaryButton>
      </div>
    </div>
  );
}
