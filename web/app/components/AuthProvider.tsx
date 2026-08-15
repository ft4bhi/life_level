"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("access_token", token);
        
        // If logged in user is on login or signup page, redirect to home
        if (pathname === "/login" || pathname === "/signup") {
          router.replace("/home");
        }
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("journal_cache");
        
        // If unauthenticated user is on a protected page, redirect to login
        const isPublic = PUBLIC_PATHS.some((path) => 
          path === "/" ? pathname === "/" : pathname.startsWith(path)
        );
        
        if (!isPublic) {
          router.replace("/login");
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Show dark loading screen while checking session to prevent page flickering
  if (authLoading) {
    const isPublic = PUBLIC_PATHS.some((path) => 
      path === "/" ? pathname === "/" : pathname.startsWith(path)
    );
    if (!isPublic) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
  }

  return <>{children}</>;
}
