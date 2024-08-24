import prisma from "@/app/db";
import { authConfig } from "@/app/lib/auth";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const data = req.nextUrl.searchParams.get("");

  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return NextResponse.json(
      {
        message: "You are not logged in",
      },
      {
        status: 401,
      }
    );
  }

  const solWallet = await prisma.solWallet.findFirst({
    where: {
      userId: session.user.uid,
    },
  });

  if (!solWallet) {
    return NextResponse.json(
      {
        message: "Couldnt find associated solana wallet",
      },
      {
        status: 401,
      }
    );
  }

  
}
