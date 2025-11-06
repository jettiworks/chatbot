import { SignInButton, SignOutButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="border-b border-[var(--foreground)]/10">
      <div className="flex container h-16 items-center justify-between px-4 mx-auto">
        <div className="text-xl font-semibold">RK Chatbot</div>
        <div className="flex gap-2">
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link href="/" className="py-2 px-3">
                  Home
                </Link>
                <Link href="/upload" className="py-2 px-3">
                  Upload
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
