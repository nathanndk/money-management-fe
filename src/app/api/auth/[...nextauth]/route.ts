// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authConfig } from "../../../../../auth.config";

// Pola resmi: buat handler lalu ekspor sebagai GET/POST
const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
