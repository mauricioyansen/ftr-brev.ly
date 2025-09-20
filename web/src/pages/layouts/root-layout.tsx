import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors />
    </>
  );
}
