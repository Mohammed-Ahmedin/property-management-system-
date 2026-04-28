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
  Upload,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/avatar";
import { formatDate } from "date-fns";
import {
  useBanUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUserRegistration,
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

  // Edit user extended state
  const [editPhone, setEditPhone] = useState("");
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editCompanyDescription, setEditCompanyDescription] = useState("");
  const [editBusinessFileUrl, setEditBusinessFileUrl] = useState("");
  const [editNationalId, setEditNationalId] = useState("");
  const [editLicenseUploading, setEditLicenseUploading] = useState(false);
  const [editRegUserId, setEditRegUserId] = useState<string | null>(null);

  const { data: editRegData } = useGetUserRegistration(editRegUserId);

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
                            setEditPhone(user.phone || "");
                            setEditCompanyName("");
                            setEditCompanyDescription("");
                            setEditBusinessFileUrl("");
                            setEditNationalId("");
                            setEditRegUserId(user.id);
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <ViewUserDetails user={viewUser} />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) { setEditUser(null); setEditRegUserId(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {/* Basic info */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+251..." />
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

            {/* Registration fields — shown when reg data exists or role is OWNER/BROKER */}
            {(editRegData?.data || editRole === "OWNER" || editRole === "BROKER") && (
              <>
                <div className="border-t pt-4 space-y-4">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Registration Details</p>

                  {(editRegData?.data?.registrationType === "OWNER" || editRole === "OWNER") && (
                    <>
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                          value={editCompanyName || editRegData?.data?.companyName || ""}
                          onChange={(e) => setEditCompanyName(e.target.value)}
                          placeholder="Company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company Description</Label>
                        <Input
                          value={editCompanyDescription || editRegData?.data?.companyDescription || ""}
                          onChange={(e) => setEditCompanyDescription(e.target.value)}
                          placeholder="Brief description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Business License</Label>
                        {(editBusinessFileUrl || editRegData?.data?.businessFileUrl) && (
                          <a
                            href={editBusinessFileUrl || editRegData?.data?.businessFileUrl}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline mb-2"
                          >
                            <FileText className="h-4 w-4" /> View current license <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <div className="flex gap-2">
                          <Input
                            value={editBusinessFileUrl || editRegData?.data?.businessFileUrl || ""}
                            onChange={(e) => setEditBusinessFileUrl(e.target.value)}
                            placeholder="License URL or upload below"
                            className="flex-1"
                          />
                          <label className="cursor-pointer">
                            <input type="file" accept="image/*,.pdf" className="hidden" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setEditLicenseUploading(true);
                              try {
                                const fd = new FormData();
                                fd.append("file", file);
                                const res = await fetch("/api/upload", { method: "POST", body: fd });
                                if (res.ok) {
                                  const data = await res.json();
                                  setEditBusinessFileUrl(data.secure_url || "");
                                }
                              } finally { setEditLicenseUploading(false); }
                            }} />
                            <div className="h-9 px-3 flex items-center gap-1 border rounded-md text-sm hover:bg-muted cursor-pointer">
                              {editLicenseUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            </div>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>National ID Document</Label>
                    {(editNationalId || editRegData?.data?.nationalId) && (
                      <a
                        href={editNationalId || editRegData?.data?.nationalId}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline mb-2"
                      >
                        <FileText className="h-4 w-4" /> View current ID <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <div className="flex gap-2">
                      <Input
                        value={editNationalId || editRegData?.data?.nationalId || ""}
                        onChange={(e) => setEditNationalId(e.target.value)}
                        placeholder="National ID URL or upload below"
                        className="flex-1"
                      />
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setEditLicenseUploading(true);
                          try {
                            const fd = new FormData();
                            fd.append("file", file);
                            const res = await fetch("/api/upload", { method: "POST", body: fd });
                            if (res.ok) {
                              const data = await res.json();
                              setEditNationalId(data.secure_url || "");
                            }
                          } finally { setEditLicenseUploading(false); }
                        }} />
                        <div className="h-9 px-3 flex items-center gap-1 border rounded-md text-sm hover:bg-muted cursor-pointer">
                          {editLicenseUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditUser(null); setEditRegUserId(null); }}>Cancel</Button>
            <Button
              disabled={updateMutation.isPending}
              onClick={() => {
                updateMutation.mutate(
                  {
                    id: editUser.id,
                    data: {
                      name: editName,
                      role: editRole,
                      phone: editPhone || undefined,
                      companyName: editCompanyName || editRegData?.data?.companyName || undefined,
                      companyDescription: editCompanyDescription || editRegData?.data?.companyDescription || undefined,
                      businessFileUrl: editBusinessFileUrl || editRegData?.data?.businessFileUrl || undefined,
                      nationalId: editNationalId || editRegData?.data?.nationalId || undefined,
                    }
                  },
                  { onSuccess: () => { setEditUser(null); setEditRegUserId(null); } }
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

function ViewUserDetails({ user }: { user: any }) {
  const { data: regData } = useGetUserRegistration(user.id);
  const reg = regData?.data;

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-3">
        <Avatar src={user.image} alt={user.name} fallback={user.name} size="lg" />
        <div>
          <p className="font-semibold text-base">{user.name}</p>
          <p className="text-muted-foreground">{user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div><p className="text-muted-foreground text-xs">Email</p><p className="break-all">{user.email}</p></div>
        <div><p className="text-muted-foreground text-xs">Phone</p><p>{user.phone || "—"}</p></div>
        <div><p className="text-muted-foreground text-xs">Verified</p><p>{user.emailVerified ? "Yes" : "No"}</p></div>
        <div><p className="text-muted-foreground text-xs">Banned</p><p>{user.banned ? "Yes" : "No"}</p></div>
        <div><p className="text-muted-foreground text-xs">Joined</p><p>{formatDate(user.createdAt, "PPP")}</p></div>
        <div><p className="text-muted-foreground text-xs">ID</p><p className="font-mono text-xs break-all">{user.id}</p></div>
      </div>

      {reg && (
        <>
          <div className="border-t pt-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Registration Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><p className="text-muted-foreground text-xs">Type</p><p>{reg.registrationType}</p></div>
              <div><p className="text-muted-foreground text-xs">Status</p><p>{reg.status}</p></div>
              {reg.companyName && <div><p className="text-muted-foreground text-xs">Company</p><p>{reg.companyName}</p></div>}
              {reg.companyDescription && <div className="sm:col-span-2"><p className="text-muted-foreground text-xs">Description</p><p>{reg.companyDescription}</p></div>}
              {reg.phone && <div><p className="text-muted-foreground text-xs">Reg. Phone</p><p>{reg.phone}</p></div>}
              {reg.businessFileUrl && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Business License</p>
                  <a href={reg.businessFileUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline text-xs">
                    <FileText className="h-3.5 w-3.5" /> View License <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {reg.nationalId && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">National ID</p>
                  <a href={reg.nationalId} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline text-xs">
                    <FileText className="h-3.5 w-3.5" /> View National ID <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
