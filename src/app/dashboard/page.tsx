import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  // Redirect based on user role
  if (session.user.role === "EMPLOYEE") {
    redirect("/dashboard/employee")
  }

  redirect("/dashboard/admin")
}
