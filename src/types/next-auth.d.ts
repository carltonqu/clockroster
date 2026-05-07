import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "SUPERVISOR" | "EMPLOYEE";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "SUPERVISOR" | "EMPLOYEE";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "SUPERVISOR" | "EMPLOYEE";
  }
}
