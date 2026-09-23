import React from 'react';
import { Mail, ShieldCheck, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { getMe } from '@/lib/api';

export const instant = false;

export default async function Profile() {
  // Fetch profile on the server directly
  const response = await getMe();
  const profileData = response?.data?.profile;

  if (!profileData) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-sm">Unable to load profile information.</p>
      </div>
    );
  }

  const { profile: subProfile } = profileData;
  const formattedDate = new Date(profileData.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className=" mx-auto space-y-6">
      {/* Header Hero Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Banner Gradient */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        </div>

        {/* Profile Content Body */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-14 gap-4 mb-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1 shadow-md shrink-0 relative overflow-hidden">
                {subProfile?.profilePhoto ? (
                  <Image
                    width={300}
                    height={300}
                    src={subProfile.profilePhoto}
                    alt={profileData.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-3xl">
                    {profileData.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {profileData.name}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wider">
                    {profileData.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {profileData.email}
                </p>
              </div>
            </div>
          </div>

          {/* User Status Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 text-xs">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold ${
                profileData.isAvailable === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: {profileData.isAvailable}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold ${
                profileData.userStatus === 'UNBAN'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Account: {profileData.userStatus === 'UNBAN' ? 'Verified / Active' : 'Banned'}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium bg-slate-100 text-slate-600 ml-auto">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Member since {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Bio & Overview */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">About / Bio</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed min-h-[60px]">
            {subProfile?.bio || 'No bio available.'}
          </p>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account ID</span>
              <p className="text-xs font-mono text-slate-700 truncate mt-0.5">{profileData.id}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile ID</span>
              <p className="text-xs font-mono text-slate-700 truncate mt-0.5">{subProfile?.id || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Account Security Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Account Details</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Role</span>
              <span className="font-semibold text-slate-800">{profileData.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Email Status</span>
              <span className="font-semibold text-emerald-600">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Last Updated</span>
              <span className="font-semibold text-slate-800">
                {new Date(profileData.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}