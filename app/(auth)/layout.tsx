import { isAuthenticated } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

async function AuthLayout({ children }: { children: ReactNode }) {
  const isAuth = await isAuthenticated();
  if (isAuth) {
    redirect("/");
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-10 px-4">
        {children}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}

export default AuthLayout;
