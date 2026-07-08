"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getTestLocations,
  addTestLocation,
  updateTestLocation,
} from "@/services/testlocation.service";
import toast from "react-hot-toast";

function TestLocationsTable({ locations, onEdit }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-left">Address</th>
            <th className="p-4 text-left">Suburb</th>
            <th className="p-4 text-left">State</th>
            <th className="p-4 text-left">Postcode</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((loc: any) => (
            <tr key={loc._id} className="border-b hover:bg-gray-50">
              <td className="p-4">{loc.location}</td>
              <td className="p-4">{loc.address}</td>
              <td className="p-4">{loc.suburb}</td>
              <td className="p-4">{loc.state}</td>
              <td className="p-4">{loc.postCode}</td>
              <td className="p-4">
                <Button size="sm" variant="outline" onClick={() => onEdit(loc)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TestLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    state: "",
    location: "",
    address: "",
    suburb: "",
    postCode: "",
  });

  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditing(null);
    setForm({ state: "", location: "", address: "", suburb: "", postCode: "" });
    setOpenModal(true);
  };

  const handleEdit = (loc: any) => {
    setEditing(loc);
    setForm({
      state: loc.state || "",
      location: loc.location || "",
      address: loc.address || "",
      suburb: loc.suburb || "",
      postCode: String(loc.postCode || ""),
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        state: form.state,
        location: form.location,
        address: form.address,
        suburb: form.suburb,
        postCode: Number(form.postCode || 0),
      };

      if (editing) {
        await updateTestLocation(editing._id, payload);
        toast.success("Test location updated successfully");
      } else {
        await addTestLocation(payload);
        toast.success("Test location created successfully");
      }

      setOpenModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save test location");
    } finally {
      setSaving(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTestLocations({ page, limit, search });
      setLocations(res.data || []);
      setMeta(res.meta || {});
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch test locations");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  useEffect(() => setPage(1), [search]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Test Locations</h1>
          <p className="text-sm text-gray-500">Manage test locations used across the app</p>
        </div>

        <Button onClick={handleAdd}>+ Add Test Location</Button>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Locations</p>
            <p className="text-3xl font-bold mt-2">{meta?.total || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Search location..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border px-3 py-2 rounded-lg">
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : (
            <TestLocationsTable locations={locations} onEdit={handleEdit} />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
          Previous
        </Button>

        <span className="px-4 py-2 text-sm">Page {page} of {meta?.totalPages || 1}</span>

        <Button variant="outline" disabled={page >= (meta?.totalPages || 1)} onClick={() => setPage((prev) => prev + 1)}>
          Next
        </Button>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Test Location" : "Add Test Location"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input placeholder="Suburb" value={form.suburb} onChange={(e) => setForm({ ...form, suburb: e.target.value })} />
            <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <Input placeholder="Postcode" value={form.postCode} onChange={(e) => setForm({ ...form, postCode: e.target.value })} />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button disabled={saving} onClick={handleSubmit}>{saving ? "Saving..." : editing ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
