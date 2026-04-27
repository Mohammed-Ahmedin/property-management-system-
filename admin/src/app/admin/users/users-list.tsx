"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Crown,
  Ban,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/avatar";
import { formatDate } from "date-fns";
import {
  useBanUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUnbanUserMutation,
  useUpdateUserMutation,
} from "@/hooks/api/use-users";

const ITEMS_PER_PAGE = 10;

export function UsersListContainer({ users }: { users: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [viewUser, setViewUser] = useState<any>(null);
  const [editUser, setEditUser] = useState<any>(null);
  const [banUser, setBanUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [banReason, setBanReason] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");

  const banMutation = useBanUserMutation();
  const unbanMutation = useUnbanUserMutation();
  const deleteMutation = useDeleteUserMutation();
  const updateMutation = useUpdateUserMutation();
  const createMutation = useCreateUserMutation();

  // Add user state
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("GUEST");

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user: any) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "banned" && user.banned) ||
        (statusFilter === "active" && !user.banned) ||
        (statusFilter === "verified" && user.emailVerified) ||
        (statusFilter === "unverified" && !user.emailVerified);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useMemo(() => setCurrentPage(1), [searchQuery, roleFilter, statusFilter]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN": return <Crown className="h-3 w-3" />;
      case "OWNER": return <Shield className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getRoleBadgeVariant = (role: string): any => {
    switch (role) {
      case "ADMIN": return "default";
      case "OWNER": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-6">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="GUEST">Guest</SelectItem>
                <SelectItem value="BROKER">Broker</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => { setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("GUEST"); setAddUserOpen(true); }}>
              <UserPlus className="h-4 w-4 mr-2" /> Add User
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user: any) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.image || undefined} alt={user.name} fallback={user.name} />
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 12)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        {user.banned ? (
                          <Badge variant="destructive" className="gap-1 w-fit">
                            <Ban className="h-3 w-3" /> Banned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 w-fit border-green-500/50 text-green-600">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </Badge>
                        )}
                        {user.emailVerified ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Unverified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(user?.createdAt, "PPP")}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewUser(user)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setEditUser(user);
                            setEditName(user.name);
                            setEditRole(user.role);
                          }}>
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`mailto:${user.email}`)}>
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.banned ? (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => unbanMutation.mutate(user.id)}
                            >
                              Unban User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => { setBanUser(user); setBanReason(""); }}
                            >
                              Ban User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteUser(user)}
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between border-t border-border px-4 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>

      {/* View Details Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar src={viewUser.image} alt={viewUser.name} fallback={viewUser.name} size="lg" />
                <div>
                  <p className="font-semibold text-base">{viewUser.name}</p>
                  <p className="text-muted-foreground">{viewUser.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div><p className="text-muted-foreground text-xs">Email</p><p className="break-all">{viewUser.email}</p></div>
                <div><p className="text-muted-foreground text-xs">Phone</p><p>{viewUser.phone || "—"}</p></div>
                <div><p className="text-muted-foreground text-xs">Verified</p><p>{viewUser.emailVerified ? "Yes" : "No"}</p></div>
                <div><p className="text-muted-foreground text-xs">Banned</p><p>{viewUser.banned ? "Yes" : "No"}</p></div>
                <div><p className="text-muted-foreground text-xs">Joined</p><p>{formatDate(viewUser.createdAt, "PPP")}</p></div>
                <div><p className="text-muted-foreground text-xs">ID</p><p className="font-mono text-xs break-all">{viewUser.id}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUEST">Guest</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="BROKER">Broker</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button
              disabled={updateMutation.isPending}
              onClick={() => {
                updateMutation.mutate(
                  { id: editUser.id, data: { name: editName, role: editRole } },
                  { onSuccess: () => setEditUser(null) }
                );
              }}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={!!banUser} onOpenChange={() => setBanUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ban User</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">You are about to ban <span className="font-medium text-foreground">{banUser?.name}</span>.</p>
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="Enter ban reason..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanUser(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={banMutation.isPending}
              onClick={() => {
                banMutation.mutate(
                  { id: banUser.id, banReason },
                  { onSuccess: () => setBanUser(null) }
                );
              }}
            >
              {banMutation.isPending ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">{deleteUser?.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteMutation.mutate(deleteUser.id, { onSuccess: () => setDeleteUser(null) });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Enter full name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="Enter email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="Set a password (min 4 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUEST">Guest</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="BROKER">Broker</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
            <Button
              disabled={createMutation.isPending || !newName.trim() || !newEmail.trim() || newPassword.length < 4}
              onClick={() => {
                createMutation.mutate(
                  { name: newName, email: newEmail, password: newPassword, role: newRole },
                  { onSuccess: () => setAddUserOpen(false) }
                );
              }}
            >
              {createMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
