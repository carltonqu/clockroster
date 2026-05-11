"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      })
      
      if (result?.error) {
        setErrorMessage("Invalid email or password.")
        setLoading(false)
      } else if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Sign in error:", err)
      setErrorMessage("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-blue-100/50 shadow-xl shadow-blue-100/50">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
          <CardDescription className="text-gray-500">
            Sign in to your ClockRoster account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
              Create one
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              ← Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
