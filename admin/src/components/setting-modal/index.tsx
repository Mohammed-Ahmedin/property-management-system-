"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  X,
  SettingsIcon,
  Bell,
  UserCircle,
  Menu,
  Crown,
  Shield,
  ArrowLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import AccountSetting from "./account-setting";
import PaymentSetting from "./payment.setting";
import GeneralSetting from "./general-setting";
import NotificationsSetting from "./notifications-setting";
import SecuritySetting from "./security-setting";

import { useAuthSession } from "@/hooks/use-auth-session";

interface SettingsModalProps {
  open: boolean;
  setIsSettingsModalOpen: Dispatch<SetStateAction<boolean>>;
  defaultTab?: any;
}

const allSettingsItems = [
  { id: "account", label: "Account", icon: UserCircle },
  { id: "payment", label: "Payment", icon: DollarSign },
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

function SettingsSidebar({
  activeSection,
  setActiveSection,
  onClose,
  settingsItems,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onClose?: () => void;
  settingsItems: typeof allSettingsItems;
}) {
  return (
    <div className="w-full h-full bg-card border-r border-border flex flex-col">
      <div className="h-[65px] p-4 border-b border-border">
        <h3 className="text-foreground text-lg font-semibold">Settings</h3>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                onClose?.();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                activeSection === item.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function MobileTabList({
  setActiveSection,
  setShowTabList,
  setIsSettingsModalOpen,
  settingsItems,
}: {
  setActiveSection: (section: string) => void;
  setShowTabList: (show: boolean) => void;
  setIsSettingsModalOpen: any;
  settingsItems: typeof allSettingsItems;
}) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-[65px] flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h2 className="text-foreground text-lg font-semibold">Settings</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSettingsModalOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tab List */}
      <div className="flex-1 py-3 px-2 space-y-2">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setShowTabList(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl  border border-border transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SettingsContent({
  activeSection,
  isModalOpen,
  setIsSettingsModalOpen,
}: {
  activeSection: string;
  isModalOpen: boolean;
  setIsSettingsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="space-y-6 pb-6">
      {activeSection === "account" && (
        <AccountSetting
          activeSection={activeSection}
          isModalOpen={isModalOpen}
        />
      )}

      {activeSection === "notifications" && <NotificationsSetting />}

      {activeSection === "payment" && (
        <PaymentSetting setIsSettingsModalOpen={setIsSettingsModalOpen} />
      )}

      {activeSection === "general" && <GeneralSetting />}

      {activeSection === "security" && <SecuritySetting />}
    </div>
  );
}

export default function SettingsModal({
  open,
  setIsSettingsModalOpen,
  defaultTab,
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState(defaultTab || "account");
  const [showTabList, setShowTabList] = useState(true);
  const isMobile = useIsMobile();
  const { role } = useAuthSession();

  // Hide payment for ADMIN
  const settingsItems = allSettingsItems.filter(
    (item) => !(item.id === "payment" && role === "ADMIN")
  );

  const onOpenChange = (bool: boolean) => {
    setIsSettingsModalOpen(bool);
    if (!bool) {
      setShowTabList(true);
    }
  };

  const handleClose = () => {
    setIsSettingsModalOpen(false);
    setShowTabList(true);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-white/10 backdrop-blur-sm transition-all duration-300"
          onClick={handleClose}
        />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="overflow-hidden flex gap-0 w-full lg:min-w-[1000px] h-[100dvh] sm:h-[80vh] max-sm:min-w-full max-sm:rounded-none p-0 bg-background border-border"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>Settings</DialogTitle>
          </VisuallyHidden>
          {/* <CHANGE> Mobile Tab List View */}
          {isMobile && showTabList && (
            <MobileTabList
              setActiveSection={setActiveSection}
              setShowTabList={setShowTabList}
              setIsSettingsModalOpen={setIsSettingsModalOpen}
              settingsItems={settingsItems}
            />
          )}

          {/* <CHANGE> Mobile Individual Tab View */}
          {isMobile && !showTabList && (
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header with Back Button */}
              <div className="h-[65px] flex items-center justify-between px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowTabList(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-foreground text-lg font-semibold">
                    {
                      settingsItems.find((item) => item.id === activeSection)
                        ?.label
                    }
                  </h2>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleClose()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <SettingsContent
                  activeSection={activeSection}
                  isModalOpen={open}
                  setIsSettingsModalOpen={setIsSettingsModalOpen}
                />
              </div>
            </div>
          )}

          {/* Desktop Layout */}
          {!isMobile && (
            <>
              {/* Desktop Sidebar */}
              <div className="w-64 hidden md:block">
                <SettingsSidebar
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  settingsItems={settingsItems}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-[65px] flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <h2 className="text-foreground/60 text-lg font-semibold">
                      {
                        settingsItems.find((item) => item.id === activeSection)
                          ?.label
                      }
                    </h2>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClose()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                  <SettingsContent
                    activeSection={activeSection}
                    isModalOpen={open}
                    setIsSettingsModalOpen={setIsSettingsModalOpen}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
