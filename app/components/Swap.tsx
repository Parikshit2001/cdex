import { ReactNode, useEffect, useState } from "react";
import { TokenWithbalance } from "../hooks/useToken";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import axios from "axios";

export function Swap({
  publicKey,
  tokenBalances,
}: {
  publicKey: string;
  tokenBalances: {
    totalBalance: number;
    tokens: TokenWithbalance[];
  } | null;
}) {
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
  const [baseAmount, setBaseAmount] = useState<string>();
  const [quoteAmount, setQuoteAmount] = useState<string>();
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState(null);

  const func = () => {
    axios
      .get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${
          baseAsset.mint
        }&outputMint=${quoteAsset.mint}&amount=${
          Number(baseAmount) * 10 ** baseAsset.decimals
        }&slippageBps=50`
      )
      .then((res) => {
        setQuoteAmount(
          (
            Number(res.data.outAmount) / Number(10 ** quoteAsset.decimals)
          ).toString()
        );
        setFetchingQuote(false);
        setQuoteResponse(res.data);
      });
  };

  useEffect(() => {
    if (!baseAmount) {
      return;
    }
    setFetchingQuote(true);
    const timeout = setTimeout(func, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [baseAsset, quoteAsset, baseAmount]);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="font-bold text-slate-600 text-2xl">Swap Tokens</p>
        </div>
        <div className="flex space-x-1 items-center">
          <p className="text-xs text-gray-400 font-semibold">Powered by</p>
          <img className="w-4 h-4" src="/jupiter.png" alt="" />
          <p className="text-xs font-semibold">Jupiter</p>
        </div>
      </div>
      <div>
        <SwapInputRow
          amount={baseAmount}
          onAmountChange={(value: string) => {
            setBaseAmount(value);
          }}
          onSelect={(asset) => {
            setBaseAsset(asset);
          }}
          selectedToken={baseAsset}
          title={"You pay:"}
          topBorderEnabled={true}
          bottomBorderEnabled={false}
          subtitle={
            <div className="text-slate-500 pt-1 text-sm pl-1 flex items-center">
              <div className="font-normal pr-1">Current Balance:</div>
              <div className="font-semibold text-xs">
                {
                  tokenBalances?.tokens.find((x) => x.name === baseAsset.name)
                    ?.balance
                }{" "}
                {baseAsset.name}
              </div>
            </div>
          }
        />

        <div className="flex justify-center">
          <div
            onClick={() => {
              let baseAssetTemp = baseAsset;
              setBaseAsset(quoteAsset);
              setQuoteAsset(baseAssetTemp);
            }}
            className="cursor-pointer rounded-full w-10 h-10 border absolute mt-[-20px] bg-white flex justify-center pt-2"
          >
            <SwapIcon />
          </div>
        </div>

        <SwapInputRow
          inputLoading={fetchingQuote}
          inputDisabled={true}
          amount={quoteAmount}
          onSelect={(asset) => {
            setQuoteAsset(asset);
          }}
          selectedToken={quoteAsset}
          title={"You receive"}
          topBorderEnabled={false}
          bottomBorderEnabled={true}
        />
      </div>
    </div>
  );
}

function SwapInputRow({
  onSelect,
  amount,
  onAmountChange,
  selectedToken,
  title,
  subtitle,
  topBorderEnabled,
  bottomBorderEnabled,
  inputDisabled,
  inputLoading,
}: {
  onSelect: (asset: TokenDetails) => void;
  selectedToken: TokenDetails;
  title: string;
  subtitle?: ReactNode;
  topBorderEnabled: boolean;
  bottomBorderEnabled: boolean;
  amount?: string;
  onAmountChange?: (value: string) => void;
  inputDisabled?: boolean;
  inputLoading?: boolean;
}) {
  return (
    <div
      className={`border flex justify-between p-6 ${
        topBorderEnabled ? "rounded-t-xl" : ""
      } ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}
    >
      <div>
        <div className="text-xs font-semibold mb-1">{title}</div>
        <AssetSelector selectedToken={selectedToken} onSelect={onSelect} />
        {subtitle}
      </div>
      <div className="flex items-center">
        {!inputLoading && (
          <input
            disabled={inputDisabled}
            onChange={(e) => {
              onAmountChange?.(e.target.value);
            }}
            placeholder="0"
            type="text"
            className="bg-slate-50 p-6 outline-none text-4xl text-right"
            value={inputLoading ? "Loading" : amount}
          ></input>
        )}
        {inputLoading && <HeroLoading />}
      </div>
    </div>
  );
}

function HeroLoading() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

function AssetSelector({
  selectedToken,
  onSelect,
}: {
  selectedToken: TokenDetails;
  onSelect: (asset: TokenDetails) => void;
}) {
  return (
    <div className="w-24">
      <select
        onChange={(e) => {
          const selectedToken = SUPPORTED_TOKENS.find(
            (x) => x.name === e.target.value
          );
          if (selectedToken) {
            onSelect(selectedToken);
          }
        }}
        id="countries"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {SUPPORTED_TOKENS.map((token) => (
          <option key={token.name} selected={selectedToken.name == token.name}>
            {token.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function SwapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="size-6"
    >
      <path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  );
}
