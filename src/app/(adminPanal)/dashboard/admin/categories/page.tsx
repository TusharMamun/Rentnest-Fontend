import { Suspense } from "react";
import { getPublicCategories, adminGetAllProperties } from "@/lib/api";
import type { Category, Property } from "@/lib/type";
import { FolderTree, Building2, Loader2 } from "lucide-react";

export const metadata = { title: "Categories | RentNest" };

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-blue-600" /> Property Categories
        </h1>
      </div>
      <Suspense fallback={<PageLoader />}>
        <CategoriesList />
      </Suspense>
    </div>
  );
}

async function CategoriesList() {
  const [catRes, propRes] = await Promise.all([getPublicCategories(), adminGetAllProperties()]);
  const categories: Category[] = catRes?.data ?? [];
  const properties: Property[] = propRes?.data ?? [];

  const countMap: Record<string, number> = {};
  for (const p of properties) {
    if (p.categoryId) countMap[p.categoryId] = (countMap[p.categoryId] ?? 0) + 1;
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-center">
        <FolderTree className="w-12 h-12 text-slate-200" />
        <h3 className="font-bold text-slate-600">No categories yet</h3>
        <p className="text-slate-400 text-sm max-w-xs">Categories are created automatically when landlords add properties.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => {
        const count = countMap[cat.id] ?? 0;
        return (
          <div key={cat.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FolderTree className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate">{cat.catagoryName}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                {count} {count === 1 ? "property" : "properties"}
              </div>
            </div>
            <span className="text-2xl font-extrabold text-blue-600">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
