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
  // const user = session?.user;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarContent className="">
          <SidebarHeader>
            <h2 className="text-lg pl-2 font-medium capitalize">
              👋 Welcome {userData?.role.toLowerCase()}
            </h2>
          </SidebarHeader>

          <NavMain role={userData?.role} />
        </SidebarContent>

        <SidebarFooter>
          <Button variant={"outline"} onClick={() => setIsModalOpen(true)}>
            <Settings /> Account{" "}
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
