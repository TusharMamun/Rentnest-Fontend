"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("searchTerm", search.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/properties${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl shadow-black/20 max-w-2xl mx-auto w-full mt-4">
      <div className="flex items-center gap-2 flex-1 px-3 py-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or keyword..."
          className="w-full text-sm text-slate-700 placeholder:text-slate-400 bg-transparent focus:outline-none" />
      </div>
      <div className="flex items-center gap-2 flex-1 px-3 py-2 border-t sm:border-t-0 sm:border-l border-slate-200">
        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
        <input value={location} onChange={e => setLocation(e.target.value)}
          placeholder="City or area..."
          className="w-full text-sm text-slate-700 placeholder:text-slate-400 bg-transparent focus:outline-none" />
      </div>
      <button type="submit"
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shrink-0">
        Search
      </button>
    </form>
  );
}
