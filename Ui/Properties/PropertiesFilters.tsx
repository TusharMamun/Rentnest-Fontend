"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, MapPin, Tag, DollarSign, X, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/lib/type";

interface Props {
  categories: Category[];
  currentFilters: {
    searchTerm?: string;
    location?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function PropertiesFilters({ categories, currentFilters }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm ?? "");
  const [location, setLocation] = useState(currentFilters.location ?? "");
  const [category, setCategory] = useState(currentFilters.category ?? "");
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice ?? "");

  const applyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
    if (location.trim()) params.set("location", location.trim());
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/properties${params.toString() ? `?${params}` : ""}`);
  };

  const clearFilters = () => {
    setSearchTerm(""); setLocation(""); setCategory(""); setMinPrice(""); setMaxPrice("");
    router.push("/properties");
  };

  const hasActiveFilters = !!(searchTerm || location || category || minPrice || maxPrice);

  return (
    <form onSubmit={applyFilters} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-5 sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filters</h3>
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1"><X className="w-3 h-3" /> Clear all</button>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search</label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Title, keyword..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input value={location} onChange={e => setLocation(e.target.value)}
            placeholder="City or area..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
        <div className="relative">
          <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white appearance-none">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.catagoryName}>{c.catagoryName}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price Range ($/mo)</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <DollarSign className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)}
              placeholder="Min" min={0} className="w-full pl-7 pr-2 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div className="relative flex-1">
            <DollarSign className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              placeholder="Max" min={0} className="w-full pl-7 pr-2 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
        Apply Filters
      </button>
    </form>
  );
}
