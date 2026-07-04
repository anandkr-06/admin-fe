"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAvailableSuburbs,
  updateInstructorServiceAreas,
} from "@/services/instructor.service";

type Props = {
  instructorId: string;
  data?: any;
  onSuccess?: () => void;
};

type SuburbOption = {
  _id: string;
  locality: string;
  postcode: string;
  state: string;
  lat: number;
  long: number;
};

export default function ServiceAreasSection({ instructorId, data, onSuccess }: Props) {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<SuburbOption[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      radiusKm: 5,
    },
  });

  useEffect(() => {
    const initial = (data?.serviceAreas || []).map((item: any) => ({
      ...item,
      radiusKm: item.radiusKm || 5,
    }));
    setSelected(initial);
  }, [data]);

  const loadSuburbs = async (query: string) => {
    try {
      const response: any = await getAvailableSuburbs(query);
      const list = response?.data?.data || response?.data || [];
      setOptions(
        list.map((item: any) => ({
          _id: item._id || item.id,
          locality: item.locality || item.suburb || item.name,
          postcode: item.postcode || item.postCode || "",
          state: item.state || "",
          lat: item.lat || 0,
          long: item.long || 0,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length >= 2) {
        loadSuburbs(search);
      } else {
        setOptions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const addSuburb = (item: SuburbOption) => {
    if (selected.some((entry) => entry.suburbId === item._id)) {
      return;
    }
    setSelected((current) => [
      ...current,
      {
        suburb: item.locality,
        postcode: String(item.postcode),
        radiusKm: 5,
        suburbId: item._id,
        lat: item.lat,
        long: item.long,
        state: item.state,
      },
    ]);
    setSearch("");
  };

  const updateRadius = (suburbId: string, radiusKm: number) => {
    setSelected((current) =>
      current.map((item) =>
        item.suburbId === suburbId ? { ...item, radiusKm } : item
      )
    );
  };

  const removeSuburb = (suburbId: string) => {
    setSelected((current) => current.filter((item) => item.suburbId !== suburbId));
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateInstructorServiceAreas(instructorId, {
        serviceAreas: selected,
      });
      toast.success("Service areas updated successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update service areas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium">Search suburb</label>
        <Input
          value={search}
          placeholder="Type suburb name"
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {options.length > 0 && (
        <div className="rounded border bg-gray-50 p-3 space-y-2">
          {options.map((item) => (
            <button
              key={item._id}
              type="button"
              className="block w-full rounded border bg-white px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => addSuburb(item)}
            >
              {item.locality}, {item.state} {item.postcode}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {selected.length === 0 && <p className="text-sm text-gray-500">No service areas selected.</p>}
        {selected.map((item) => (
          <div
            key={item.suburbId}
            className="w-full shrink-0 rounded border p-3 sm:basis-[calc(50%-0.375rem)] xl:basis-[calc(25%-0.5625rem)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{item.suburb}</p>
                <p className="text-sm text-gray-500">{item.postcode} • {item.state}</p>
              </div>
              <button type="button" className="text-sm text-red-500" onClick={() => removeSuburb(item.suburbId)}>
                Remove
              </button>
            </div>
            <div className="mt-3">
              <label className="mb-2 block text-sm font-medium">Radius (km)</label>
              <Input
                type="number"
                min={1}
                value={item.radiusKm ?? 5}
                onChange={(event) => updateRadius(item.suburbId, Number(event.target.value || 5))}
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Service Areas"}
      </Button>
    </div>
  );
}
