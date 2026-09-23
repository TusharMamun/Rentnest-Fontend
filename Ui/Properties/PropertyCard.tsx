import Link from "next/link";
import Image from "next/image";
import { MapPin, DollarSign } from "lucide-react";
import type { Property } from "@/lib/type";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative w-full h-44 overflow-hidden bg-slate-100">
        <Image src={property.image} alt={property.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${property.isAvailable === "AVAILABLE" ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
          {property.isAvailable === "AVAILABLE" ? "Available" : "Rented"}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        {property.catagory && (
          <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{property.catagory.catagoryName}</span>
        )}
        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">{property.title}</h3>
        <p className="flex items-center gap-1 text-slate-500 text-xs"><MapPin className="w-3.5 h-3.5" />{property.location}</p>
        {property.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {property.amenities.slice(0, 3).map(a => (
              <span key={a} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{a}</span>
            ))}
            {property.amenities.length > 3 && <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full">+{property.amenities.length - 3}</span>}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center gap-0.5 font-bold text-blue-600 text-sm">
            <DollarSign className="w-4 h-4" />{property.pricePerMonth.toLocaleString()}<span className="text-xs text-slate-400 font-normal ml-1">/mo</span>
          </div>
          <span className="text-xs text-blue-600 font-semibold">Details →</span>
        </div>
      </div>
    </Link>
  );
}
