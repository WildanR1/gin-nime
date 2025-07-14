import Link from "next/link";
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
  Users,
  Shield,
  Calendar,
  Mail,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Kelola User
            </h1>
            <p className="text-muted-foreground">
              Mengelola pengguna yang terdaftar di platform
            </p>
          </div>
          <Link href="/admin/user/tambah">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah User
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari user berdasarkan nama atau email..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Filter Role
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Filter Tanggal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Table or Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar User ({userList.length})</CardTitle>
          <CardDescription>
            Kelola pengguna yang terdaftar di platform
          </CardDescription>
        </CardHeader>
        <CardContent className={userList.length === 0 ? "p-6" : "p-0"}>
          {userList.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Belum ada user</h3>
              <p className="text-muted-foreground mb-6">
                Belum ada pengguna yang terdaftar di platform.
              </p>
              <Link href="/admin/user/tambah">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah User Pertama
                </Button>
              </Link>
            </div>
          ) : (
            // Data Table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Bergabung</th>
                    <th className="text-left p-4 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b hover:bg-muted/50 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name?.charAt(0).toUpperCase() ||
                              user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {user.name || "Tidak ada nama"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-muted-foreground mr-2" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            user.role === "ADMIN" ? "default" : "secondary"
                          }
                          className={
                            user.role === "ADMIN" ? "bg-red-500 text-white" : ""
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-muted-foreground text-sm">
                          {new Date(user.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link href={`/admin/user/edit/${user.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-500"
                            disabled={user.id === session.user?.id}
                            title={
                              user.id === session.user?.id
                                ? "Tidak dapat menghapus akun sendiri"
                                : "Hapus user"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total User</CardTitle>
            <Users className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userList.length}</div>
            <p className="text-xs text-muted-foreground">pengguna terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userList.filter((user) => user.role === "ADMIN").length}
            </div>
            <p className="text-xs text-muted-foreground">admin aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Biasa</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userList.filter((user) => user.role === "USER").length}
            </div>
            <p className="text-xs text-muted-foreground">user biasa</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
