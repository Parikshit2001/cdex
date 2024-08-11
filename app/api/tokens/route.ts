import { getSupportedTokens, connection } from "@/app/lib/constants";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address") as string;
  const supportedTokens = await getSupportedTokens();
  const balances = await Promise.all(
    supportedTokens.map((token) => getAccountBalance(token, address))
  );

  const tokens = supportedTokens.map((token, index) => ({
    ...token,
    balance: balances[index].toFixed(2),
    usdBalance: (balances[index] * Number(token.price)).toFixed(2),
  }));

  return NextResponse.json({
    tokens,
    totalBalance: tokens
      .reduce((acc, val) => acc + Number(val.usdBalance), 0)
      .toFixed(2),
  });
}

async function getAccountBalance(
  token: {
    name: string;
    mint: string;
    native: boolean;
    decimals: number;
  },
  address: string
) {
  if (token.native) {
    let balance = await connection.getBalance(new PublicKey(address));
    console.log("balance is " + balance);
    return balance / LAMPORTS_PER_SOL;
  }
  const ata = await getAssociatedTokenAddress(
    new PublicKey(token.mint),
    new PublicKey(address)
  );
  try {
    const account = await getAccount(connection, ata);
    return Number(account.amount) / 10 ** token.decimals;
  } catch (error) {
    return 0;
  }
}
