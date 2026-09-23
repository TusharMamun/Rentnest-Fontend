import Link from "next/link";
import Image from "next/image";
import { MapPin, DollarSign, Star } from "lucide-react";
import type { Property } from "@/lib/type";

export default function FeaturedCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <Image src={property.image} alt={property.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${property.isAvailable === "AVAILABLE" ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
            {property.isAvailable === "AVAILABLE" ? "Available" : "Rented"}
          </span>
        </div>
        {property.catagory && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-slate-700 shadow-sm">
              {property.catagory.catagoryName}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed flex-1">{property.description}</p>
        {property.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {property.amenities.slice(0, 3).map(a => (
              <span key={a} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">{a}</span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">+{property.amenities.length - 3}</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-blue-600 font-bold">
            <DollarSign className="w-4 h-4" />
            <span>{property.pricePerMonth.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <span className="text-xs text-blue-600 font-semibold group-hover:underline">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
