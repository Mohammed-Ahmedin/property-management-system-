"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Bell, FlipVertical, LogOut, MoreVertical, User } from "lucide-react";
import { Avatar } from "../shared/avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { AccountSettingsModal } from "../account-setting-modal";
import { Button } from "../ui/button";

export function NavUser({
  user,
}: {
  user: { name: string; email: string; id: string; image: string; role: any };
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar
                src={user?.image || ""}
                alt={user?.name}
                size={"lg"}
                fallback={user?.name}
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground uppercase truncate text-xs font-bold">
                  {user?.role}
                </span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar
                  src={user?.image || ""}
                  alt={user?.name}
                  size={"lg"}
                  fallback={user?.name}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <AccountSettingsModal>
                <Button
                  variant={"ghost"}
                  className="w-full text-start flex justify-start font-normal"
                >
                  <User />
                  Account
                </Button>
              </AccountSettingsModal>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                localStorage.removeItem("admin_session_token");
                localStorage.removeItem("admin_session_user");
                await authClient.signOut();
                window.location.href = "/auth";
              }}
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
