'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  ClipboardList,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export default function DashboardHome() {
  // Sample Stats - In production, fetch these from your backend API
  const stats = [
    {
      label: 'Total Properties',
      value: '12',
      change: '+12.5%',
      icon: Building2,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Active Requests',
      value: '24',
      change: '+18.2%',
      icon: ClipboardList,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Total Tenants',
      value: '38',
      change: '+4.5%',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Monthly Revenue',
      value: '$14,250',
      change: '+8.1%',
      icon: CreditCard,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  // Sample Recent Activity
  const recentActivities = [
    {
      id: 1,
      type: 'request',
      title: 'New Rental Application',
      description: 'John Doe submitted a request for Apt 4B',
      time: '10 mins ago',
      icon: Clock,
      iconColor: 'text-amber-500 bg-amber-50',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      description: 'Received $1,200 rent from Sarah Jenkins',
      time: '2 hours ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 bg-emerald-50',
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance Request',
      description: 'Plumbing inquiry reported in Unit 12',
      time: '5 hours ago',
      icon: AlertCircle,
      iconColor: 'text-blue-500 bg-blue-50',
    },
  ];

  // Sample Recent Rental Requests
  const recentRequests = [
    {
      id: 'REQ-101',
      property: 'Sunset Apartments - Unit 4B',
      applicant: 'John Doe',
      date: 'Sep 14, 2026',
      status: 'Pending',
      statusColor: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    },
    {
      id: 'REQ-102',
      property: 'Green Valley Villa #2',
      applicant: 'Sarah Jenkins',
      date: 'Sep 12, 2026',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    },
    {
      id: 'REQ-103',
      property: 'Downtown Loft Apt 10',
      applicant: 'Michael Smith',
      date: 'Sep 10, 2026',
      status: 'Rejected',
      statusColor: 'bg-red-50 text-red-700 ring-red-600/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-md">
            <TrendingUp className="h-3.5 w-3.5" /> Platform Performance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back to your dashboard!
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Here is a quick overview of your property listings, rental applications, and revenue performance for this month.
          </p>
        </div>
        {/* Background decorative ring */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {stat.change}
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Actions & Recent Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Rental Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Applications
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest rental requests submitted by prospective tenants
              </p>
            </div>
            <Link
              href="/dashboard/rentals"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Property</th>
                  <th className="py-3 px-5">Applicant</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-800">
                      {request.property}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {request.applicant}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {request.date}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 ring-inset ${request.statusColor}`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quick Actions & Recent Activity Feed */}
        <div className="space-y-6">
          
          {/* Quick Action Shortcuts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/landlord/properties"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 transition-all text-center gap-2 group"
              >
                <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Add Property</span>
              </Link>

              <Link
                href="/dashboard/rentals"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 transition-all text-center gap-2 group"
              >
                <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 transition-colors">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">View Requests</span>
              </Link>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.iconColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {activity.description}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}