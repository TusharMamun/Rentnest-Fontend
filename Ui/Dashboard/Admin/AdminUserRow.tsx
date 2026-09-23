"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import { banUserAction, unbanUserAction } from "@/src/actions/admin.actions";
import { toast } from "sonner";
import type { User } from "@/lib/type";

const roleColors: Record<string, string> = {
  ADMIN:    "bg-purple-50 text-purple-700",
  LANDLORD: "bg-indigo-50 text-indigo-700",
  TENANT:   "bg-emerald-50 text-emerald-700",
};

export default function AdminUserRow({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isBanned = user.userStatus === "BAN";

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = isBanned ? await unbanUserAction(user.id) : await banUserAction(user.id);
      if (!result?.success) throw new Error(result?.message || "Action failed");
      toast.success(`User ${isBanned ? "unbanned" : "banned"} successfully.`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors text-sm">
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-5">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${roleColors[user.role]}`}>
          {user.role}
        </span>
      </td>
      <td className="py-3.5 px-5">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isBanned ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {isBanned ? <ShieldX className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
          {isBanned ? "Banned" : "Active"}
        </span>
      </td>
      <td className="py-3.5 px-5 text-xs text-slate-500">
        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </td>
      <td className="py-3.5 px-5">
        {user.role !== "ADMIN" && (
          <button onClick={handleToggle} disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60 ${isBanned ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isBanned ? <ShieldCheck className="w-3 h-3" /> : <ShieldX className="w-3 h-3" />}
            {isBanned ? "Unban" : "Ban"}
          </button>
        )}
      </td>
    </tr>
  );
}
