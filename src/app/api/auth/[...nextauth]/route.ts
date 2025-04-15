export const dynamic = 'force-dynamic'

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth: handler } = NextAuth(authConfig);

export { handler as GET, handler as POST }; 