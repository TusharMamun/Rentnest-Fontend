import { Shield, Zap, HeartHandshake, Users, Building2, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services | RentNest" };

const services = [
  {
    icon: Building2,
    title: "Property Listing",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
    description: "List your property in minutes with our intuitive dashboard. Reach thousands of verified tenants instantly.",
    features: ["Unlimited photos", "Detailed descriptions", "Real-time availability", "Category tagging"],
  },
  {
    icon: Shield,
    title: "Tenant Verification",
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
    description: "Every tenant on RentNest goes through our verification process so landlords can rent with confidence.",
    features: ["Identity checks", "Rental history", "Background review", "Verified badge"],
  },
  {
    icon: Zap,
    title: "Instant Rental Requests",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
    description: "Tenants can apply to any listing in seconds. Landlords receive and process requests from a single dashboard.",
    features: ["One-click apply", "Approval workflow", "Date range booking", "Status tracking"],
  },
  {
    icon: HeartHandshake,
    title: "Secure Stripe Payments",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
    description: "All payments are processed securely through Stripe. Landlords get paid on time, every time.",
    features: ["PCI compliant", "Instant receipts", "Payment history", "Refund support"],
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    color: "bg-rose-50 text-rose-600",
    border: "border-rose-100",
    description: "Build trust through transparent reviews. Tenants review properties; landlords build their reputation.",
    features: ["5-star ratings", "Written comments", "Verified reviews only", "Public profile scores"],
  },
  {
    icon: Users,
    title: "24/7 Support",
    color: "bg-indigo-50 text-indigo-600",
    border: "border-indigo-100",
    description: "Our support team is always on standby to help landlords and tenants resolve any issues quickly.",
    features: ["Live chat", "Email support", "Dispute resolution", "FAQ knowledge base"],
  },
];

const howItWorks = [
  { step: "1", title: "Create Your Account", desc: "Sign up as a tenant or landlord in under 2 minutes." },
  { step: "2", title: "Find or List a Property", desc: "Tenants browse verified listings. Landlords post their properties." },
  { step: "3", title: "Submit a Rental Request", desc: "Apply for a property and await landlord approval." },
  { step: "4", title: "Pay Securely & Move In", desc: "Complete payment via Stripe and get your keys." },
];

export default function ServicesPage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center space-y-4 py-10">
        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-wider">Our Services</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          Everything You Need to <br className="hidden md:block" />
          <span className="text-blue-600">Rent Smarter</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
          RentNest provides a complete suite of tools for landlords and tenants — from listing to lease signing, all in one place.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/properties" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">Browse Properties</Link>
          <Link href="/signup" className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 transition-colors">Get Started Free</Link>
        </div>
      </section>

      {/* Services Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.title} className={`bg-white rounded-2xl border ${s.border} shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow`}>
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.description}</p>
                <ul className="space-y-1.5">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900 rounded-3xl px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">How RentNest Works</h2>
          <p className="text-slate-400 mt-2 text-sm">Four simple steps to your next home.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map(item => (
            <div key={item.step} className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">{item.step}</div>
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-8 py-14 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Ready to Get Started?</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm">Join thousands of satisfied users on RentNest today.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition-colors">
          Create Free Account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
