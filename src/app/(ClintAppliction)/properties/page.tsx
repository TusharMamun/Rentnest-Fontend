import { Suspense } from "react";
import { getPublicCategories } from "@/lib/api";
import type { Category } from "@/lib/type";
import PropertiesFilters from "@/Ui/Properties/PropertiesFilters";
import PropertiesResults from "@/Ui/Properties/PropertiesResults";
import { Building2, Loader2 } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
    location?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export const metadata = { title: "Properties | RentNest" };

export default async function PropertiesPage({ searchParams }: PageProps) {
  // searchParams is a request-time API — only read inside Suspense
  const categoriesRes = await getPublicCategories();
  const categories: Category[] = categoriesRes?.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600" /> Browse Properties
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters — wrapped so searchParams read happens inside Suspense */}
        <aside className="w-full lg:w-72 shrink-0">
          <Suspense fallback={<FilterSkeleton />}>
            <FiltersWithParams searchParams={searchParams} categories={categories} />
          </Suspense>
        </aside>

        {/* Property Grid */}
        <main className="flex-1">
          <Suspense fallback={<GridSkeleton />}>
            <PropertiesResults searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// Reads searchParams inside Suspense — safe for streaming
async function FiltersWithParams({
  searchParams,
  categories,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
  categories: Category[];
}) {
  const sp = await searchParams;
  return <PropertiesFilters categories={categories} currentFilters={sp} />;
}

function FilterSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-slate-100 rounded-xl" />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
