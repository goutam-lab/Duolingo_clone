"use client";

import React from "react";
import { UserMeResponse } from "@/types/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { RightSidebar } from "@/components/layout/RightSidebar";

interface AppShellProps {
  user: UserMeResponse | null;
  onHeartsRefilled?: (hearts: number) => void;
  courseTitle?: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  user,
  onHeartsRefilled,
  courseTitle,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <Sidebar />
      <div className="md:ml-[280px] lg:mr-[368px] min-h-screen pb-20 md:pb-4">
        <TopNav
          user={user}
          onHeartsRefilled={onHeartsRefilled}
          courseTitle={courseTitle}
        />
        <div className="w-full max-w-[598px] mx-auto">{children}</div>
      </div>
      <RightSidebar user={user} onHeartsRefilled={onHeartsRefilled} />
    </div>
  );
};
