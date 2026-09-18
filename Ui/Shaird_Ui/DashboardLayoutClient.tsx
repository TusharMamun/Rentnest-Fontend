'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  User as UserIcon,
  CreditCard,
  Star,
  FolderTree,
  ClipboardList,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { logout } from '@/lib/api';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ('ADMIN' | 'LANDLORD' | 'TENANT')[];
}

const sidebarItems: SidebarItem[] = [
  // Shared Overview
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },

  // Tenant Routes
  { label: 'My Rental Requests', href: '/dashboard/rentals', icon: ClipboardList, roles: ['TENANT'] },
  { label: 'Payment History', href: '/dashboard/payments', icon: CreditCard, roles: ['TENANT'] },
  { label: 'My Reviews', href: '/dashboard/reviews', icon: Star, roles: ['TENANT'] },

  // Landlord Routes
  { label: 'My Properties', href: '/dashboard/landlord/properties', icon: Building2, roles: ['LANDLORD'] },
  { label: 'Rental Requests', href: '/dashboard/landlord/requests', icon: ClipboardList, roles: ['LANDLORD'] },
  { label: 'Create Property', href: '/dashboard/landlord/createProperty', icon: Building2, roles: ['LANDLORD'] },

  // Admin Routes
  { label: 'User Management', href: '/dashboard/admin/users', icon: Users, roles: ['ADMIN'] },
  { label: 'All Listings', href: '/dashboard/admin/properties', icon: Building2, roles: ['ADMIN'] },
  { label: 'Categories', href: '/dashboard/admin/categories', icon: FolderTree, roles: ['ADMIN'] },
  { label: 'All Requests', href: '/dashboard/admin/rentals', icon: ClipboardList, roles: ['ADMIN'] },

  // Common Account Routes
  { label: 'My Profile', href: '/dashboard/profile', icon: UserIcon },

];

interface ClientLayoutProps {
  children: React.ReactNode;
  user?: {
    data?: {
      profile?: {
        role?: 'ADMIN' | 'LANDLORD' | 'TENANT';
        name?: string;
      };
    };
  };
}

export default function DashboardLayoutClient({ children, user }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const userProfile = user?.data?.profile;
  const userRole = userProfile?.role || 'TENANT';
  const userName = userProfile?.name || 'User';

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Filter routes according to current user role
  const filteredSidebarItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const pathSegments = pathname.split('/').filter(Boolean);


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 antialiased">
      {/* 1. Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 2. Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight"
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg text-white shadow-sm shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <span>RentNest</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge & Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Main Menu
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold uppercase">
              {userRole}
            </span>
          </div>

          {filteredSidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* 3. Main Body Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Welcome message with Dynamic Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="hover:text-slate-900 font-medium">
                Welcome, <strong className="text-slate-800">{userName}</strong>
              </span>
              {pathSegments.map((segment) => (
                <React.Fragment key={segment}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="capitalize text-slate-800 font-semibold">
                    {segment}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/10">
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="hidden md:inline text-xs font-semibold text-slate-700">
                {userName}
              </span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content Viewport */}
        <main className="flex-1 w-full">
          <div className="mx-auto max-w-11xl px-4 sm:px-6 lg:px-8 w-full py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}