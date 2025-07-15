"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah!");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-slate-800/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"></div>

      <div className="relative w-full max-w-md">
        {/* Enhanced Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-sky-600 transition-colors flex items-center group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>

        <Card className="border-sky-500/20 shadow-xl backdrop-blur-sm hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent rounded-lg"></div>
          <CardHeader className="text-center pb-8 relative">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-sky-500/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Image
                src="/image/logo.png"
                alt="GinAnime Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                Gin<span className="text-sky-500">Anime</span>
              </span>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              Admin Panel
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Masuk ke dashboard administrasi
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-800 bg-red-50/50 border border-red-200/50 rounded-lg dark:text-red-400 dark:bg-red-900/30 dark:border-red-800">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ginanime.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-sky-500/30 focus:border-sky-500 focus:ring-sky-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-sky-500/30 focus:border-sky-500 focus:ring-sky-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-sky-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 border-0 shadow-lg shadow-sky-500/25"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
              </Button>
            </form>

            {/* Enhanced Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-br from-sky-50/50 to-blue-50/50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg border border-sky-500/20">
              <div className="text-foreground text-sm font-medium mb-2 flex items-center gap-2">
                <div className="h-2 w-2 bg-sky-500 rounded-full animate-pulse"></div>
                💡 Demo Credentials:
              </div>
              <div className="text-muted-foreground text-xs space-y-1">
                <p className="font-mono">admin@ginanime.com</p>
                <p className="font-mono">admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Security Notice */}
        <div className="mt-6 text-center">
          <div className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <div className="h-2 w-2 bg-sky-500 rounded-full"></div>
            🔒 Area khusus administrator. Semua aktivitas dicatat.
          </div>
        </div>
      </div>
    </div>
  );
}
