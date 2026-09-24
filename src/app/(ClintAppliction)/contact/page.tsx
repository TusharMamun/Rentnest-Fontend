"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Loader2, MessageSquare, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@rentnest.com", href: "mailto:support@rentnest.com" },
  { icon: Phone, label: "Phone", value: "+1 (800) 123-4567", href: "tel:+18001234567" },
  { icon: MapPin, label: "Office", value: "123 Main Street, New York, NY 10001", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 9am–6pm EST", href: "#" },
];

const faqs = [
  { q: "How do I list my property?", a: "Create a landlord account, go to your dashboard, and click 'Create Property'. Fill in the details and publish in minutes." },
  { q: "Is my payment secure?", a: "Yes. All payments are processed by Stripe, which is PCI-DSS Level 1 certified — the highest level of security for payment processors." },
  { q: "Can I cancel a rental request?", a: "You can contact the landlord directly through the platform. Our support team can also assist with disputes." },
  { q: "How do I report a problem?", a: "Use this contact form or email us at support@rentnest.com. We respond within 24 hours." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission (no backend endpoint for contact form)
    await new Promise(res => setTimeout(res, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-wider">Contact Us</span>
        <h1 className="text-4xl font-extrabold text-slate-900">We&apos;d Love to Hear From You</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-base">Have a question, feedback, or need support? Our team is here to help.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          {contactInfo.map(item => {
            const Icon = item.icon;
            return (
              <a key={item.label} href={item.href}
                className="flex items-start gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                </div>
              </a>
            );
          })}
          {/* Quick links */}
          <div className="bg-blue-600 text-white rounded-2xl p-6 space-y-3 shadow-lg shadow-blue-500/20">
            <Building2 className="w-8 h-8 opacity-80" />
            <h3 className="font-bold text-lg">Looking to rent?</h3>
            <p className="text-blue-100 text-sm">Browse our verified property listings and find your perfect home.</p>
            <a href="/properties" className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              Browse Properties →
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
              <p className="text-slate-500 text-sm">We&apos;ll get back to you at <strong>{form.email || "your email"}</strong> within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Send us a Message</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                    placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                    placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Subject *</label>
                <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required
                  placeholder="How can we help?" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Message *</label>
                <textarea rows={6} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required
                  placeholder="Tell us more..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map(faq => (
            <div key={faq.q} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-2">{faq.q}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
