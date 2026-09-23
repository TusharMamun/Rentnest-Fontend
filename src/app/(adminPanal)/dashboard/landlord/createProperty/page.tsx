"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, X, Building, DollarSign, MapPin, UploadCloud, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import { imageUpload } from "@/lib/api";
import { createPropertyAction } from "@/src/actions/property.actions";
import { toast } from "sonner";

interface ICreatePropertyInputs {
  title: string;
  description: string;
  location: string;
  pricePerMonth: number;
  isAvailable: "AVAILABLE" | "NOT_AVAILABLE";
  categoryName: string;
}

const COMMON_AMENITIES = ["WiFi", "Air Conditioning", "Swimming Pool", "Gym", "Parking", "Balcony", "Pet Friendly", "Security", "Laundry", "CCTV"];
const CATEGORIES = ["Apartment", "House", "Villa", "Studio", "Commercial"];

export default function CreatePropertyPage() {
  const [amenities, setAmenities] = useState<string[]>(["WiFi", "Air Conditioning"]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ICreatePropertyInputs>({
    defaultValues: { isAvailable: "AVAILABLE", categoryName: "Apartment" },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFileError("Please upload a valid image file (PNG, JPG, WEBP)"); return; }
    if (file.size > 5 * 1024 * 1024) { setFileError("Image must be under 5MB"); return; }
    setFileError(null);
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); }
  };

  const handleToggleAmenity = (item: string) => {
    setAmenities(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) { setAmenities(prev => [...prev, trimmed]); setCustomAmenity(""); }
  };

  const onSubmit = async (data: ICreatePropertyInputs) => {
    if (!selectedFile) { setFileError("Property image is required"); return; }
    setIsSubmitting(true);
    setFileError(null);
    try {
      const imageURL = await imageUpload(selectedFile);
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("description", data.description);
      formData.set("location", data.location);
      formData.set("pricePerMonth", String(data.pricePerMonth));
      formData.set("categoryName", data.categoryName);
      formData.set("isAvailable", data.isAvailable);
      formData.set("amenities", JSON.stringify(amenities));
      formData.set("imageUrl", imageURL);

      const result = await createPropertyAction(formData);
      if (!result?.success) throw new Error(result?.message || "Failed to create property");

      toast.success("Property created successfully!");
      reset({ isAvailable: "AVAILABLE", categoryName: "Apartment" });
      handleRemoveFile();
      setAmenities(["WiFi", "Air Conditioning"]);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-sm rounded-2xl my-4 border border-slate-200/80">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-6 h-6 text-blue-600" /> Create New Property
        </h1>
        <p className="text-sm text-slate-500 mt-1">Fill in the details below to list a new rental property.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Property Title *</label>
          <input type="text" placeholder="e.g. Modern Sunset Apartment"
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Category & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select {...register("categoryName")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
            <select {...register("isAvailable")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white">
              <option value="AVAILABLE">Available</option>
              <option value="NOT_AVAILABLE">Not Available</option>
            </select>
          </div>
        </div>

        {/* Price & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price Per Month ($) *</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input type="number" placeholder="1500"
                {...register("pricePerMonth", { required: "Price is required", min: { value: 1, message: "Must be > 0" }, valueAsNumber: true })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            {errors.pricePerMonth && <p className="text-xs text-red-500 mt-1">{errors.pricePerMonth.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input type="text" placeholder="123 Main Street, Downtown"
                {...register("location", { required: "Location is required" })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Property Image *</label>
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <UploadCloud className="w-10 h-10 mb-2 text-slate-400" />
              <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="relative w-full h-52 rounded-xl overflow-hidden border border-slate-200">
              <Image width={800} height={400} src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={handleRemoveFile} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea rows={4} placeholder="Provide a detailed description..."
            {...register("description", { required: "Description is required" })}
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
                <button key={item} type="button" onClick={() => handleToggleAmenity(item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selected ? "bg-blue-600 text-white border-blue-600" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`}>
                  {selected ? "✓ " : "+ "}{item}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input type="text" value={customAmenity} onChange={e => setCustomAmenity(e.target.value)}
              placeholder="Add custom amenity" className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <button type="button" onClick={handleAddCustomAmenity}
              className="px-4 py-2 text-sm bg-slate-800 text-white rounded-xl hover:bg-slate-700 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              {amenities.map(item => (
                <span key={item} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-blue-100 text-blue-800 border border-blue-200">
                  <Sparkles className="w-3 h-3" />{item}
                  <button type="button" onClick={() => setAmenities(prev => prev.filter(a => a !== item))} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
