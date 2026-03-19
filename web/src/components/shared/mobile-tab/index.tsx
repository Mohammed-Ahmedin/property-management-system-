import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mobileNavLinks } from "@/const/links";

// Links for navigation

// CustomNavigate component using React Router
const CustomNavigate: React.FC<{
  to: string;
  className?: string;
  children: React.ReactNode;
}> = ({ to, className = "", children }) => {
  const navigate = useNavigate();
  return (
    <div className={className} onClick={() => navigate(to)}>
      {children}
    </div>
  );
};

interface SmallDeviceTabsProps {
  className?: string;
}

const MobileTab: React.FC<SmallDeviceTabsProps> = ({ className = "" }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const hideBar = pathname.includes("rooms") || pathname.includes("/rooms");

  if (hideBar) {
    return;
  }
  return (
    <div
      className={cn(
        `fixed bottom-0 left-0 right-0 z-40 w-full h-[70px] border-t shadow-md bg-background ${className}`
      )}
    >
      <div className="w-full h-full">
        <div className="w-full h-full grid grid-cols-5">
          {mobileNavLinks.map((link) => {
            const isActive = link.href === pathname;

            return (
              <CustomNavigate
                key={link.id}
                to={link.href}
                className={`relative h-full flex justify-center items-center ${
                  isActive ? "" : ""
                }`}
              >
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                  {link.icon}
                  <span className="text-xs">{link.label}</span>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <span className="absolute -top-1 w-[10px] h-[10px] rounded-full bg-primary" />
                )}
              </CustomNavigate>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileTab;
