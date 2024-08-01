import React from "react";

export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100svh-140px)] flex-col items-center justify-center gap-4">
      {children}
    </div>
  );
}