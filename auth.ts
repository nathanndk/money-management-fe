// src/auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// HANYA ekspor yang Anda pakai di app (tanpa handlers)
export const { auth, signIn, signOut } = NextAuth(authConfig);
