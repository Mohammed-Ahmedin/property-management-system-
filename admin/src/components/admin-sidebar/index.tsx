"use clinet";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import SettingsModal from "../setting-modal";

interface UserSessionType {
  name: string;
  email: string;
  id: string;
  image: string;
  role: any;
}

export function AdminSidebar({ userData }: { userData: UserSessionType }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Sidebar collapsible="offcanvas" variant="inset" className="bg-[#1a4a2e] border-r border-[#1a4a2e]">
        <SidebarContent className="bg-[#1a4a2e]">
          <SidebarHeader className="bg-[#1a4a2e] border-b border-white/10 pb-3">
            {/* Logo + name */}
            <div className="flex items-center gap-2.5 px-2 pt-1">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
                <img src="https://res.cloudinary.com/dmhsqmdbc/image/upload/v1776093694/bete_uploads/nvducfh9nbyixyatxrp9.jpg" alt="Kuru Rent" className="w-full h-full object-cover" />
              </div>
              <span
                className="text-lg font-bold text-[#c9a227]"
                style={{ textShadow: "0 1px 0 #8a6d0a, 0 2px 4px rgba(0,0,0,0.3)" }}
              >
                Kuru Rent
              </span>
            </div>
            <p className="text-xs text-white/50 px-2 mt-1 capitalize">
              👋 Welcome {userData?.role?.toLowerCase()}
            </p>
          </SidebarHeader>

          <NavMain role={userData?.role} />
        </SidebarContent>

        <SidebarFooter className="bg-[#1a4a2e] border-t border-white/10">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="border-white/20 text-[#c9a227] hover:bg-white/10 hover:text-[#c9a227] bg-transparent"
          >
            <Settings className="mr-2 h-4 w-4" /> Account
          </Button>
          <NavUser
            user={{
              name: userData?.name!,
              email: userData?.email!,
              id: userData?.id!,
              image: userData?.image!,
              role: userData?.role,
            }}
          />
        </SidebarFooter>
      </Sidebar>

      <SettingsModal open={isModalOpen} setIsSettingsModalOpen={setIsModalOpen} />
    </>
  );
}
