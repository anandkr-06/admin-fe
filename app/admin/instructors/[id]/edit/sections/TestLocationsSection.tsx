"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getTestLocationOptions,
  updateInstructorTestLocations,
} from "@/services/instructor.service";

type Props = {
  instructorId: string;
  data?: any;
  onSuccess?: () => void;
};

type Option = {
  _id: string;
  suburb: string;
  postCode: string;
  state: string;
  address: string;
  location: string;
};

export default function TestLocationsSection({ instructorId, data, onSuccess }: Props) {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initial = (data?.testLocations || []).map((item: any) => ({
      _id: item.locationId || item._id || `${item.suburb}-${item.postCode}`,
      suburb: item.suburb,
      postCode: item.postCode || item.postcode || "",
      state: item.state || "",
      address: item.address || "",
      location: item.location || "",
    }));
    setSelected(initial);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length >= 2) {
        loadTestLocations(search);
      } else {
        setOptions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadTestLocations = async (query: string) => {
    try {
      const response: any = await getTestLocationOptions(query);
      const list = response?.data?.data || response?.data || [];
      setOptions(
        list.map((item: any) => ({
          _id: item._id || item.locationId,
          suburb: item.suburb || "",
          postCode: item.postCode || item.postcode || "",
          state: item.state || "",
          address: item.address || "",
          location: item.location || "",
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addLocation = (item: Option) => {
    if (selected.some((entry) => entry._id === item._id)) {
      return;
    }
    setSelected((current) => [...current, item]);
    setSearch("");
  };

  const removeLocation = (id: string) => {
    setSelected((current) => current.filter((item) => item._id !== id));
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateInstructorTestLocations(instructorId, {
        testLocations: selected.map((item) => ({
          suburb: item.suburb,
          postCode: item.postCode,
          state: item.state,
          locationId: item._id,
          address: item.address,
          location: item.location,
        })),
      });
      toast.success("Test locations updated successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update test locations");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium">Search test location</label>
        <Input value={search} placeholder="Type suburb or location" onChange={(event) => setSearch(event.target.value)} />
      </div>

      {options.length > 0 && (
        <div className="rounded border bg-gray-50 p-3 space-y-2">
          {options.map((item) => (
            <button
              key={item._id}
              type="button"
              className="block w-full rounded border bg-white px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => addLocation(item)}
            >
              {item.location || item.suburb}, {item.address}, {item.suburb}, {item.state}, {item.postCode}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {selected.length === 0 && <p className="text-sm text-gray-500">No test locations selected.</p>}
        {selected.map((item) => (
          <div
            key={item._id}
            className="flex w-full shrink-0 items-center justify-between gap-3 rounded border p-3 sm:basis-[calc(50%-0.375rem)] xl:basis-[calc(25%-0.5625rem)]"
          >
            <div>
              <p className="font-medium">{item.location || item.suburb}</p>
              <p className="text-sm text-gray-500">{item.address} • {item.suburb} • {item.state} • {item.postCode}</p>
            </div>
            <button type="button" className="text-sm text-red-500" onClick={() => removeLocation(item._id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Test Locations"}
      </Button>
    </div>
  );
}
