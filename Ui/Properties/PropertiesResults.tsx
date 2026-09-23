import { getPublicProperties } from "@/lib/api";
import type { Property } from "@/lib/type";
import PropertyCard from "./PropertyCard";
import { SearchX } from "lucide-react";

interface Props {
  searchParams: Promise<{
    searchTerm?: string;
    location?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function PropertiesResults({ searchParams }: Props) {
  const sp = await searchParams;

  const res = await getPublicProperties({
    searchTerm: sp.searchTerm,
    location: sp.location,
    catagoyName: sp.category,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
  });

  const properties: Property[] = res?.data ?? [];
  const hasFilters = !!(sp.searchTerm || sp.location || sp.category || sp.minPrice || sp.maxPrice);

  return (
    <>
      <p className="text-sm text-slate-500 mb-4">
        {properties.length} {properties.length === 1 ? "property" : "properties"} found
        {hasFilters ? " matching your search" : " available now"}
      </p>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white rounded-2xl border border-slate-200">
          <SearchX className="w-12 h-12 text-slate-300" />
          <h3 className="font-bold text-slate-700">No properties found</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Try adjusting your search filters or clear them to see all available listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </>
  );
}
