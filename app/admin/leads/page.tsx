"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLeads } from "@/services/admin.service";
import { Users } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await getLeads({
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        setLeads(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalLeads = meta?.total || 0;

  const newLearners = leads.filter(
    (l) => l.userType === "New Learner"
  ).length;

  const exploreSource = leads.filter(
    (l) => l.source === "COURSE_EXPLORE"
  ).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Leads
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track learner inquiries and interests
          </p>
        </div>

        {/* <Button>
          <Users size={16} className="mr-2" />
          Export
        </Button> */}
      </div>

      {/* KPI Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Leads" value={totalLeads} />
        <StatCard title="New Learners" value={newLearners} color="text-green-600" />
        <StatCard title="Course Explore Source" value={exploreSource} color="text-blue-600" />
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <EmptyState />
          ) : (
            <LeadsTable leads={leads} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, color = "text-gray-900" }: any) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function LeadsTable({ leads }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">User Type</th>
            <th className="p-4 text-left">Source</th>
            <th className="p-4 text-left">Consent</th>
            <th className="p-4 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead: any) => (
            <tr key={lead._id} className="border-b hover:bg-gray-50 transition">
              <td className="p-4 font-medium">
                {lead.firstName} {lead.lastName}
              </td>

              <td className="p-4">
                <div>{lead.email}</div>
                <div className="text-xs text-gray-500">{lead.phone}</div>
              </td>

              <td className="p-4">
                {lead.course?.courseName || "-"}
              </td>

              <td className="p-4">
                {lead.course?.category || "-"}
              </td>

              <td className="p-4">
                <UserTypeBadge type={lead.userType} />
              </td>

              <td className="p-4">
                <SourceBadge source={lead.source} />
              </td>

              <td className="p-4 text-xs">
                <div>
                  T&C:{" "}
                  {lead.isAgreedToTermsAndConditions ? "✅" : "❌"}
                </div>
                <div>
                  Offers:{" "}
                  {lead.isAgreedToCommunicationAndOffers ? "✅" : "❌"}
                </div>
              </td>

              <td className="p-4 text-gray-500">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserTypeBadge({ type }: any) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
      {type}
    </span>
  );
}

function SourceBadge({ source }: any) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
      {source}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 space-y-4">
      <div className="text-6xl">📋</div>
      <h2 className="text-xl font-semibold">
        No Leads Found
      </h2>
      <p className="text-gray-500 text-sm">
        Leads will appear here when users explore courses.
      </p>
    </div>
  );
}