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
  getSuburbs,
  createSuburb,
  updateSuburb,
} from "@/services/services/suburb.service";
function SuburbsTable({
  suburbs,
  onEdit,
}: {
  suburbs: any[];
  onEdit: (suburb: any) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left">Locality</th>
            <th className="p-4 text-left">State</th>
            <th className="p-4 text-left">Postcode</th>
            <th className="p-4 text-left">Latitude</th>
            <th className="p-4 text-left">Longitude</th>
            <th className="p-4 text-left">Active</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {suburbs.map((suburb) => (
            <tr key={suburb._id} className="border-b hover:bg-gray-50">
              <td className="p-4">{suburb.locality}</td>
              <td className="p-4">{suburb.state}</td>
              <td className="p-4">{suburb.postcode}</td>
              <td className="p-4">{suburb.lat}</td>
              <td className="p-4">{suburb.long}</td>
              <td className="p-4">{suburb.isActive ? "Yes" : "No"}</td>

              <td className="p-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(suburb)}
                >
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

export default function SuburbsPage() {
  const [suburbs, setSuburbs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editingSuburb, setEditingSuburb] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    postcode: "",
    lat: "",
    long: "",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingSuburb(null);

    setFormData({
      name: "",
      state: "",
      postcode: "",
      lat: "",
      long: "",
      isActive: true,
    });

    setOpenModal(true);
  };

  const handleEdit = (suburb: any) => {
    setEditingSuburb(suburb);

    setFormData({
      name: suburb.locality,
      state: suburb.state,
      postcode: suburb.postcode,
      lat: String(suburb.lat),
      long: String(suburb.long),
      isActive: suburb.isActive,
    });

    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        name: formData.name,
        state: formData.state,
        postcode: formData.postcode,
        lat: Number(formData.lat),
        long: Number(formData.long),
         isActive: formData.isActive,
      };

      if (editingSuburb) {
        await updateSuburb({
          ...payload,
          _id: editingSuburb._id,
        });
      } else {
        await createSuburb(payload);
      }

      setOpenModal(false);

      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getSuburbs({
        page,
        limit: 10,
        search,
      });

      setSuburbs(res.data || []);
      setMeta(res.meta || {});
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(timeout);
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Suburbs</h1>

          <p className="text-sm text-gray-500">
            Manage suburb locations and postcodes
          </p>
        </div>

        <Button onClick={handleAdd}>+ Add Suburb</Button>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Suburbs</p>

            <p className="text-3xl font-bold mt-2">{meta?.total || 0}</p>
          </CardContent>
        </Card>
      </div>

      <input
        placeholder="Search suburb..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      />

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : (
            <SuburbsTable suburbs={suburbs} onEdit={handleEdit} />
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>

        <span className="px-4 py-2 text-sm">
          Page {page} of {meta?.totalPages || 1}
        </span>

        <Button
          variant="outline"
          disabled={page >= (meta?.totalPages || 1)}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSuburb ? "Edit Suburb" : "Add Suburb"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Locality"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <Input
              placeholder="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  state: e.target.value,
                })
              }
            />

            <Input
              placeholder="Postcode"
              value={formData.postcode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  postcode: e.target.value,
                })
              }
            />

            <Input
              placeholder="Latitude"
              value={formData.lat}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lat: e.target.value,
                })
              }
            />

            <Input
              placeholder="Longitude"
              value={formData.long}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  long: e.target.value,
                })
              }
            />
            {/* <div className="flex items-center justify-between border rounded-md px-3 py-2"> */}
            {/* <label className="text-sm font-medium">Active</label> */}
            <select
              value={formData.isActive ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "true",
                })
              }
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            {/* </div> */}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>

              <Button disabled={saving} onClick={handleSubmit}>
                {saving ? "Saving..." : editingSuburb ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
