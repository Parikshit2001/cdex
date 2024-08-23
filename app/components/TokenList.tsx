import { TokenWithbalance } from "../hooks/useToken";

export function TokenList({ tokens }: { tokens: TokenWithbalance[] }) {
  return (
    <div className="">
      {tokens.map((token) => (
        <div key={token.mint}>
          <TokenRow token={token} />
          <hr />
        </div>
      ))}
    </div>
  );
}

function TokenRow({ token }: { token: TokenWithbalance }) {
  return (
    <div className="flex py-2 justify-between">
      <div className="flex space-x-2">
        <div>
          <img
            className="w-10 h-10 rounded-full overflow-hidden"
            src={token.image}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between">
          <p className="text-sm font-bold">{token.name}</p>
          <p className="text-xs text-gray-500">
            1{token.name} ≈ {parseFloat(token.price).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <div>
            <p> {token.balance} </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold pl-1">
              {token.name}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div>
            <p className="text-sm text-gray-500 font-semibold pr-1">$</p>
          </div>
          <div>
            <p> {token.usdBalance} </p>
          </div>
        </div>
      </div>
    </div>
  );
}
