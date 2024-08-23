import { getServerSession } from "next-auth";
import { ProfileCard } from "../components/ProfileCard";
import { authConfig } from "../lib/auth";
import prisma from "../db";

async function getUserWallet() {
  const sesssion = await getServerSession(authConfig);

  const userWallet = await prisma.solWallet.findFirst({
    where: {
      userId: sesssion?.user?.uid,
    },
    select: {
      publicKey: true,
    },
  });

  if (!userWallet) {
    return {
      error: "No solana wallet found associated to the user",
    };
  }

  return { error: null, userWallet };
}

async function Dashboard() {
  const userWallet = await getUserWallet();

  if (userWallet.error || !userWallet.userWallet?.publicKey) {
    return <>No solana wallet found</>;
  }

  return (
    <div>
      <ProfileCard publicKey={userWallet.userWallet.publicKey} />
    </div>
  );
}

export default Dashboard;
