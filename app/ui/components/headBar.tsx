import { auth, signOut } from "@/auth";
import { merriweather } from "../fonts";
import Link from "next/link";

const HeadBar = async () => {
  const session = await auth();
  return (
    <div className="w-screen h-11 bg-[#e9e0b4] flex flex-row items-center justify-between p-5">
      <div className={`${merriweather.className} text-[#B4BDE9] font-bold`}>
        <Link href="/calendar">
          <span className="mr-2">🗓️</span> PlanView
        </Link>
      </div>
      {session && (
        <button
          className="bg-[#B4BDE9] text-white rounded-md w-20 h-8"
          onClick={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          LogOut
        </button>
      )}
      {!session && (
        <Link href="/login">
          <button className="bg-[#B4BDE9] text-white rounded-md w-20 h-8">
            LogIn
          </button>
        </Link>
      )}
    </div>
  );
};

export default HeadBar;
