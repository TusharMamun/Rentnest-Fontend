import { getPublicPropertyById } from "@/lib/api";
import { getMe } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, DollarSign, Tag, CheckCircle2, ArrowLeft, Star, Building2 } from "lucide-react";
import RentRequestForm from "@/Ui/Properties/RentRequestForm";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getPublicPropertyById(id);
  if (!res?.data) return { title: "Property | RentNest" };
  return { title: `${res.data.title} | RentNest` };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const [propertyRes, userRes] = await Promise.all([getPublicPropertyById(id), getMe()]);

  if (!propertyRes?.data) notFound();

  const property = propertyRes.data;
  const user = userRes?.data?.profile;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Listings
      </Link>

      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden bg-slate-100 shadow-lg">
        {property.image ? (
          <Image src={property.image} alt={property.title} fill sizes="100vw" className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <Building2 className="w-16 h-16 text-blue-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-5">
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${property.isAvailable === "AVAILABLE" ? "bg-emerald-500 text-white" : "bg-slate-700 text-white"}`}>
            {property.isAvailable === "AVAILABLE" ? "Available" : "Not Available"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title block */}
          <div>
            {property.catagory && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                <Tag className="w-3 h-3" />{property.catagory.catagoryName}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{property.title}</h1>
            <p className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
              <MapPin className="w-4 h-4 text-blue-500" />{property.location}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-5 py-3 rounded-2xl w-fit">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-extrabold text-blue-700">{property.pricePerMonth.toLocaleString()}</span>
            <span className="text-slate-500 text-sm">/month</span>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-3">About this Property</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Landlord info */}
          {property.landlord && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-3">Listed by</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {property.landlord.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{property.landlord.name}</p>
                  <p className="text-xs text-slate-500">{property.landlord.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {property.reviews && property.reviews.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Reviews ({property.reviews.length})</h2>
              <div className="space-y-4">
                {property.reviews.map(r => (
                  <div key={r.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    {r.comment && <p className="text-sm text-slate-600">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <RentRequestForm property={property} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
