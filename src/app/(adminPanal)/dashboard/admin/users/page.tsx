import { Suspense } from "react";
import { adminGetAllUsers } from "@/lib/api";
import type { User } from "@/lib/type";
import { Users, Loader2 } from "lucide-react";
import AdminUserRow from "@/Ui/Dashboard/Admin/AdminUserRow";

export const metadata = { title: "User Management | RentNest" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" /> User Management
        </h1>
      </div>
      <Suspense fallback={<PageLoader />}>
        <UsersList />
      </Suspense>
    </div>
  );
}

async function UsersList() {
  const res = await adminGetAllUsers();
  const users: User[] = res?.data ?? [];

  const active = users.filter((u) => u.isAvailable === "ACTIVE").length;
  const banned = users.filter((u) => u.userStatus === "BAN").length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length,                                    bg: "bg-blue-50",    text: "text-blue-700" },
          { label: "Admins",      value: users.filter((u) => u.role === "ADMIN").length,   bg: "bg-purple-50",  text: "text-purple-700" },
          { label: "Landlords",   value: users.filter((u) => u.role === "LANDLORD").length, bg: "bg-indigo-50", text: "text-indigo-700" },
          { label: "Tenants",     value: users.filter((u) => u.role === "TENANT").length,  bg: "bg-emerald-50", text: "text-emerald-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white`}>
            <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Joined</th>
                <th className="py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.map((u) => <AdminUserRow key={u.id} user={u} />)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
