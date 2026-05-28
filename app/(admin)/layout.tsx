import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { TopNav } from "@/components/TopNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }
  return (
    <>
      <TopNav />
      <div className="tab-panels-container">{children}</div>
    </>
  );
}
