"use client";

import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("journal_cache");
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
