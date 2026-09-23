import { Suspense } from "react";
import { getMe, getLandlordProperties, getMyRentalRequests, adminGetAllUsers, adminGetAllRentals, adminGetAllProperties } from "@/lib/api";
import type { User, Property, RentalRequest } from "@/lib/type";
import Link from "next/link";
import {
  Building2, Users, ClipboardList, CreditCard,
  TrendingUp, ArrowUpRight, Plus, CheckCircle2, Clock, ChevronRight, Loader2,
} from "lucide-react";

export const metadata = { title: "Dashboard | RentNest" };

export default function DashboardHome() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const userRes = await getMe();
  const role: string = userRes?.data?.profile?.role ?? "TENANT";
  const firstName: string = userRes?.data?.profile?.name?.split(" ")[0] ?? "User";

  let properties: Property[]    = [];
  let requests: RentalRequest[] = [];
  let users: User[]             = [];

  if (role === "LANDLORD") {
    const [pRes, rRes] = await Promise.all([getLandlordProperties(), getMyRentalRequests()]);
    properties = pRes?.data ?? [];
    requests   = rRes?.data ?? [];
  } else if (role === "ADMIN") {
    const [pRes, rRes, uRes] = await Promise.all([adminGetAllProperties(), adminGetAllRentals(), adminGetAllUsers()]);
    properties = pRes?.data ?? [];
    requests   = rRes?.data ?? [];
    users      = uRes?.data ?? [];
  } else {
    const rRes = await getMyRentalRequests();
    requests = rRes?.data ?? [];
  }

  const revenue = requests.filter((r) => r.status === "CONFIRMED").reduce((s, r) => s + r.totalPrice, 0);

  const stats =
    role === "ADMIN"
      ? [
          { label: "Total Properties",  value: String(properties.length),          icon: Building2,     color: "bg-blue-50 text-blue-600" },
          { label: "Total Requests",    value: String(requests.length),            icon: ClipboardList, color: "bg-amber-50 text-amber-600" },
          { label: "Total Users",       value: String(users.length),               icon: Users,         color: "bg-emerald-50 text-emerald-600" },
          { label: "Confirmed Revenue", value: `$${revenue.toLocaleString()}`,     icon: CreditCard,    color: "bg-indigo-50 text-indigo-600" },
        ]
      : role === "LANDLORD"
      ? [
          { label: "My Properties",     value: String(properties.length),                                                     icon: Building2,     color: "bg-blue-50 text-blue-600" },
          { label: "Pending Requests",  value: String(requests.filter((r) => r.status === "PENDING").length),                icon: ClipboardList, color: "bg-amber-50 text-amber-600" },
          { label: "Confirmed Rentals", value: String(requests.filter((r) => r.status === "CONFIRMED").length),              icon: CheckCircle2,  color: "bg-emerald-50 text-emerald-600" },
          { label: "Revenue",           value: `$${revenue.toLocaleString()}`,                                               icon: CreditCard,    color: "bg-indigo-50 text-indigo-600" },
        ]
      : [
          { label: "My Requests",  value: String(requests.length),                                                      icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
          { label: "Approved",     value: String(requests.filter((r) => r.status === "APPROVED").length),              icon: CheckCircle2,  color: "bg-emerald-50 text-emerald-600" },
          { label: "Confirmed",    value: String(requests.filter((r) => r.status === "CONFIRMED").length),             icon: Building2,     color: "bg-indigo-50 text-indigo-600" },
          { label: "Pending",      value: String(requests.filter((r) => r.status === "PENDING").length),               icon: Clock,         color: "bg-amber-50 text-amber-600" },
        ];

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statusColorMap: Record<string, string> = {
    PENDING:   "bg-amber-50 text-amber-700 ring-amber-600/20",
    APPROVED:  "bg-blue-50 text-blue-700 ring-blue-600/20",
    CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    REJECTED:  "bg-red-50 text-red-700 ring-red-600/20",
  };

  const allRequestsHref =
    role === "ADMIN" ? "/dashboard/admin/rentals"
    : role === "LANDLORD" ? "/dashboard/landlord/requests"
    : "/dashboard/rentals";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-md">
            <TrendingUp className="h-3.5 w-3.5" /> Platform Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            {role === "ADMIN"
              ? "Here's the full platform overview for this month."
              : role === "LANDLORD"
              ? "Here's a summary of your property listings and rental activity."
              : "Here's a summary of your rental requests and activity."}
          </p>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.color}`}><Icon className="w-5 h-5" /></div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Live <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Requests</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest rental requests</p>
          </div>
          <Link href={allRequestsHref} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No rental requests yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Property</th>
                  {(role === "ADMIN" || role === "LANDLORD") && <th className="py-3 px-5">Tenant</th>}
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-800 max-w-[180px] truncate">
                      {r.property?.title ?? "Property"}
                    </td>
                    {(role === "ADMIN" || role === "LANDLORD") && (
                      <td className="py-3.5 px-5 text-slate-600">{r.tenant?.name ?? "—"}</td>
                    )}
                    <td className="py-3.5 px-5 text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 ring-inset ${statusColorMap[r.status] ?? ""}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {role === "LANDLORD" && (
            <Link href="/dashboard/landlord/createProperty"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 transition-all text-sm font-semibold">
              <Plus className="w-4 h-4" /> Add Property
            </Link>
          )}
          {role !== "LANDLORD" && (
            <Link href="/properties"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 transition-all text-sm font-semibold">
              <Building2 className="w-4 h-4" /> Browse Properties
            </Link>
          )}
          <Link href="/dashboard/profile"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 transition-all text-sm font-semibold">
            <Users className="w-4 h-4" /> My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
