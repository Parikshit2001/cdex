import { signIn, useSession } from "next-auth/react";
import { SecondaryButton } from "./Button";
import { useRouter } from "next/navigation";

function Hero() {
  const session = useSession();
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col items-center py-20">
      <div className="flex flex-col items-center space-y-5">
        <h1 className="text-6xl font-medium">
          The Indian Cryptocurrency{" "}
          <span className="text-blue-500">Revolution</span>
        </h1>
        <div className="text-gray-500 flex flex-col items-center text-2xl">
          <h2 className="">
            Create a frictionless wallet from India with just a Google Account.
          </h2>
          <h2 className="">Convert your INR into Cryptocurrency</h2>
        </div>
        {session.data?.user ? (
          <SecondaryButton
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Go to Dashboard
          </SecondaryButton>
        ) : (
          <SecondaryButton onClick={() => signIn("google")}>
            Login with Google
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}

export default Hero;
