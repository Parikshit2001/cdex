import { Connection } from "@solana/web3.js";
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";

let LAST_UPDATED: number | null = null;
let prices: {
  [key: string]: {
    price: string;
  };
} = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // every 60s

export const connection = new Connection(
  process.env.NEXT_PUBLIC_MAINNET_URL ?? "https://api.mainnet-beta.solana.com"
);

// Returns supported Tokens and their current Price
export async function getSupportedTokens() {
  if (
    !LAST_UPDATED ||
    new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL
  ) {
    try {
      const response = await axios.get(
        `https://api.jup.ag/price/v2?ids=${SUPPORTED_TOKENS[0].mint},${SUPPORTED_TOKENS[1].mint},${SUPPORTED_TOKENS[2].mint}`
      );
      prices = response.data.data;
      LAST_UPDATED = new Date().getTime();
    } catch (e) {
      console.log(e);
    }
  }
  return SUPPORTED_TOKENS.map((s) => ({
    ...s,
    price: prices[s.mint].price,
  }));
}
