"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getCourseLeads } from "@/services/courseProvider.service";

export default function CourseLeadsPage() {
  const { courseId } = useParams();

  const [leads, setLeads] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await getCourseLeads(courseId as string, {
        page,
        limit: 10,
        startDate,
        endDate,
        // search, // if backend supports
      });

      setLeads(res.data || []);
      setMeta(res.meta || {});
    } catch (err) {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    fetchLeads();
  }, [courseId, page, startDate, endDate]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Course Leads</h1>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* <input
          type="text"
          placeholder="Search name/email..."
          className="border px-3 py-2 rounded text-sm"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        /> */}

        <input
          type="date"
          className="border px-3 py-2 rounded text-sm"
          value={startDate}
          onChange={(e) => {
            setPage(1);
            setStartDate(e.target.value);
          }}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded text-sm"
          value={endDate}
          onChange={(e) => {
            setPage(1);
            setEndDate(e.target.value);
          }}
        />

        <button
          onClick={() => {
            setSearch("");
            setStartDate("");
            setEndDate("");
            setPage(1);
          }}
          className="px-3 py-2 text-sm bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <div>Loading...</div>
      ) : leads.length === 0 ? (
        <div>No leads found</div>
      ) : (
        <div className="overflow-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">User Type</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Consent</th>
                <th className="p-3 text-left">Created</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {lead.firstName} {lead.lastName}
                  </td>

                  <td className="p-3 text-xs">{lead.email}</td>

                  <td className="p-3">{lead.phone}</td>

                  <td className="p-3">{lead.userType}</td>

                  <td className="p-3">{lead.source}</td>

                  <td className="p-3 text-xs">
                    {lead.location?.suburb}, {lead.location?.state} -{" "}
                    {lead.location?.postCode}
                  </td>

                  <td className="p-3 text-xs space-y-1">
                    <div
                      className={`px-2 py-1 rounded inline-block ${
                        lead.isAgreedToTermsAndConditions
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Terms
                    </div>

                    <div
                      className={`px-2 py-1 rounded inline-block ${
                        lead.isAgreedToCommunicationAndOffers
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Marketing
                    </div>
                  </td>

                  <td className="p-3 text-xs">
                    {format(new Date(lead.createdAt), "dd MMM yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-between items-center text-sm">
        <div>
          Page {meta.page || 1} of {meta.totalPages || 1}
        </div>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}