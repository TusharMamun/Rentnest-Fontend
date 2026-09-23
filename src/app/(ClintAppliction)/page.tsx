import Link from "next/link";
import Image from "next/image";
import {
  Building2, MapPin, Star, Shield, Search,
  CheckCircle2, ArrowRight, Zap, HeartHandshake, Users
} from "lucide-react";
import { getPublicProperties, getPublicCategories } from "@/lib/api";
import type { Property, Category } from "@/lib/type";

// ─── Hero Search Bar (client island) ─────────────────────────────────────────
import HeroSearch from "@/Ui/Homepage/HeroSearch";
import FeaturedCard from "@/Ui/Homepage/FeaturedCard";

export default async function Homepage() {
  const [propertiesRes, categoriesRes] = await Promise.all([
    getPublicProperties(),
    getPublicCategories(),
  ]);

  const properties: Property[] = propertiesRes?.data?.slice(0, 6) ?? [];
  const categories: Category[] = categoriesRes?.data ?? [];

  const features = [
    { icon: Shield, title: "Verified Listings", desc: "Every property is reviewed and verified by our team before it goes live." },
    { icon: Zap, title: "Instant Booking", desc: "Submit rental requests in seconds and get landlord approval fast." },
    { icon: HeartHandshake, title: "Secure Payments", desc: "Stripe-powered payments keep your money safe until move-in." },
    { icon: Users, title: "Trusted Community", desc: "Thousands of landlords and tenants trust RentNest every month." },
  ];

  const stats = [
    { label: "Active Listings", value: "2,400+" },
    { label: "Happy Tenants", value: "18,000+" },
    { label: "Cities Covered", value: "120+" },
    { label: "Avg. Rating", value: "4.9 ★" },
  ];

  return (
    <div className="space-y-20">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 py-20 md:py-28 text-white text-center shadow-2xl shadow-blue-500/20">
        <div className="absolute inset-0 bg-[url('/globe.svg')] opacity-5 bg-center bg-cover pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-blue-100 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Trusted by 18,000+ tenants
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find Your Perfect <br />
            <span className="text-yellow-300">Home to Rent</span>
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Browse thousands of verified properties, book securely, and move in with confidence.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <section className="-mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 text-center">
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Browse by Category</h2>
            <Link href="/properties" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <Link key={cat.id} href={`/properties?category=${encodeURIComponent(cat.catagoryName)}`}
                className="px-5 py-2.5 rounded-full bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-sm font-semibold border border-blue-100 hover:border-blue-600 transition-all">
                {cat.catagoryName}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Properties ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Properties</h2>
            <p className="text-sm text-slate-500 mt-1">Hand-picked listings available right now</p>
          </div>
          <Link href="/properties" className="hidden sm:flex items-center gap-1 text-sm text-blue-600 font-semibold hover:underline">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {properties.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No properties available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <FeaturedCard key={p.id} property={p} />)}
          </div>
        )}
        <div className="text-center mt-8">
          <Link href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition-colors">
            Explore All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 rounded-3xl px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Why Choose RentNest?</h2>
          <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">Everything you need for a smooth, stress-free renting experience.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-center transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-8 py-14 text-center">
        <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Are You a Landlord?</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm">
          List your property for free and reach thousands of verified tenants in your area.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition-colors">
            List Your Property
          </Link>
          <Link href="/properties" className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-colors">
            Browse Listings
          </Link>
        </div>
      </section>
    </div>
  );
}
