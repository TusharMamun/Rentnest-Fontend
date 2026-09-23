"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { Building, DollarSign, MapPin, UploadCloud, X, Plus, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { imageUpload } from "@/lib/api";
import { updatePropertyAction } from "@/src/actions/property.actions";
import { toast } from "sonner";

interface IEditPropertyInputs {
  title: string;
  description: string;
  location: string;
  pricePerMonth: number;
  categoryName: string;
}

const COMMON_AMENITIES = ["WiFi", "Air Conditioning", "Swimming Pool", "Gym", "Parking", "Balcony", "Pet Friendly", "Security", "Laundry", "CCTV"];
const CATEGORIES = ["Apartment", "House", "Villa", "Studio", "Commercial"];

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IEditPropertyInputs>();

  // Fetch current property data
  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/properties/${id}`)
      .then(r => r.json())
      .then(res => {
        if (res?.data) {
          const p = res.data;
          reset({
            title: p.title,
            description: p.description,
            location: p.location,
            pricePerMonth: p.pricePerMonth,
            categoryName: p.catagory?.catagoryName ?? "Apartment",
          });
          setAmenities(p.amenities ?? []);
          setExistingImage(p.image ?? null);
        }
      })
      .catch(() => toast.error("Failed to load property"));
  }, [id, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFileError("Please upload a valid image file"); return; }
    setFileError(null);
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); }
  };

  const onSubmit = async (data: IEditPropertyInputs) => {
    setIsSubmitting(true);
    setFileError(null);
    try {
      let imageUrl = "";
      if (selectedFile) imageUrl = await imageUpload(selectedFile);

      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("description", data.description);
      formData.set("location", data.location);
      formData.set("pricePerMonth", String(data.pricePerMonth));
      formData.set("categoryName", data.categoryName);
      formData.set("amenities", JSON.stringify(amenities));
      if (imageUrl) formData.set("imageUrl", imageUrl);

      const result = await updatePropertyAction(id, formData);
      if (!result?.success) throw new Error(result?.message || "Failed to update property");

      toast.success("Property updated successfully!");
      router.push("/dashboard/landlord/properties");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-sm rounded-2xl my-4 border border-slate-200/80">
      <div className="mb-6">
        <Link href="/dashboard/landlord/properties" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-6 h-6 text-blue-600" /> Edit Property
        </h1>
        <p className="text-sm text-slate-500 mt-1">Update the details below to modify your listing.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Property Title *</label>
          <input type="text" {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select {...register("categoryName")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price Per Month ($) *</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input type="number" {...register("pricePerMonth", { required: "Price is required", min: 1, valueAsNumber: true })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            {errors.pricePerMonth && <p className="text-xs text-red-500 mt-1">{errors.pricePerMonth.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" {...register("location", { required: "Location is required" })}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
          </div>
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Property Image</label>
          {existingImage && !imagePreview && (
            <div className="mb-2">
              <p className="text-xs text-slate-400 mb-1">Current image:</p>
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                <Image src={existingImage} alt="Current" fill sizes="100vw" className="object-cover" />
              </div>
            </div>
          )}
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <UploadCloud className="w-8 h-8 mb-1 text-slate-400" />
              <p className="text-sm text-slate-500">Upload new image (optional)</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
              <Image width={800} height={400} src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={handleRemoveFile} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea rows={4} {...register("description", { required: "Description is required" })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_AMENITIES.map(item => {
              const selected = amenities.includes(item);
              return (
                <button key={item} type="button" onClick={() => setAmenities(prev => selected ? prev.filter(a => a !== item) : [...prev, item])}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selected ? "bg-blue-600 text-white border-blue-600" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`}>
                  {selected ? "✓ " : "+ "}{item}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input type="text" value={customAmenity} onChange={e => setCustomAmenity(e.target.value)}
              placeholder="Add custom amenity" className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <button type="button" onClick={() => { const t = customAmenity.trim(); if (t && !amenities.includes(t)) { setAmenities(p => [...p, t]); setCustomAmenity(""); } }}
              className="px-4 py-2 text-sm bg-slate-800 text-white rounded-xl hover:bg-slate-700 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              {amenities.map(item => (
                <span key={item} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-blue-100 text-blue-800 border border-blue-200">
                  <Sparkles className="w-3 h-3" />{item}
                  <button type="button" onClick={() => setAmenities(p => p.filter(a => a !== item))} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
