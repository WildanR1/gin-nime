import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Filter,
  Users,
  Crown,
  Shield,
  UserCheck,
} from "lucide-react";

const prisma = new PrismaClient();

async function getUserList() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function UserManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const userList = await getUserList();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Pengguna
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Mengelola pengguna yang terdaftar di platform GinAnime
          </p>
        </div>
        <Button className="bg-sky-500 hover:bg-sky-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Cari pengguna berdasarkan nama atau email..."
                className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-slate-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter Role
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-slate-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Filter Tanggal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                Daftar Pengguna ({userList.length})
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Kelola pengguna yang terdaftar di platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                Belum ada pengguna
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Belum ada pengguna yang terdaftar di platform.
              </p>
              <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pengguna
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Pengguna</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Email</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Role</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Status</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Bergabung</th>
                    <th className="text-left p-4 font-medium text-slate-600 dark:text-slate-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-700/20"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                            <span className="text-sky-600 dark:text-sky-400 font-semibold text-sm">
                              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-slate-900 dark:text-white truncate">
                              {user.name || "Tanpa Nama"}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900 dark:text-white">
                          {user.email}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            user.role === "ADMIN"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                          }
                        >
                          {user.role === "ADMIN" ? (
                            <>
                              <Crown className="w-3 h-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              User
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Aktif
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-600 dark:text-slate-300">
                          {new Date(user.createdAt).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 border-slate-200 dark:border-slate-600 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                            title="Edit Pengguna"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.role !== "ADMIN" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Pengguna
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userList.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Admin
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userList.filter(user => user.role === "ADMIN").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  User Biasa
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userList.filter(user => user.role === "USER").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Pengguna Aktif
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userList.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
