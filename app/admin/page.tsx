"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api.client";

type Stats = {
  totalInstructors: number;
  totalLearners: number;
  activeInstructors: number;
  activeLearners: number;
  totalWallet: number;
  avgExperience: string;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [instructorsRes, learnersRes] =
          await Promise.all([
            apiFetch("/instructors"),
            apiFetch("/learners"),
          ]);

        // ✅ Always exclude soft-deleted records
        const instructorData =
          (instructorsRes?.data || []).filter(
            (i: any) => i.isDeleted !== true
          );

        const learnerData =
          (learnersRes?.data || []).filter(
            (l: any) => l.isDeleted !== true
          );

        // ✅ Active Counts
        const activeInstructors =
          instructorData.filter(
            (i: any) => i.isActive === true
          ).length;

        const activeLearners =
          learnerData.filter(
            (l: any) => l.isActive === true
          ).length;

        // ✅ Wallet Sum
        const totalWallet = learnerData.reduce(
          (sum: number, l: any) =>
            sum + Number(l.walletBalance || 0),
          0
        );

        // ✅ Average Experience
        const avgExperience =
          instructorData.length > 0
            ? (
                instructorData.reduce(
                  (sum: number, i: any) =>
                    sum +
                    Number(
                      i.instructorExperienceYears || 0
                    ),
                  0
                ) / instructorData.length
              ).toFixed(1)
            : "0.0";

        setStats({
          totalInstructors: instructorData.length,
          totalLearners: learnerData.length,
          activeInstructors,
          activeLearners,
          totalWallet,
          avgExperience,
        });
      } catch (err) {
        console.error("Dashboard load failed", err);
        setStats({
          totalInstructors: 0,
          totalLearners: 0,
          activeInstructors: 0,
          activeLearners: 0,
          totalWallet: 0,
          avgExperience: "0.0",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Instructors"
          value={stats!.totalInstructors}
          subtitle={`Active: ${stats!.activeInstructors}`}
          subtitleColor="text-green-600"
        />

        <StatCard
          title="Total Learners"
          value={stats!.totalLearners}
          subtitle={`Active: ${stats!.activeLearners}`}
          subtitleColor="text-blue-600"
        />
{/* 
        <StatCard
          title="Total Wallet Balance"
          value={`$${stats!.totalWallet.toFixed(2)}`}
          valueColor="text-indigo-600"
        /> */}

        <StatCard
          title="Avg Instructor Experience"
          value={`${stats!.avgExperience} yrs`}
        />
      </div>
    </div>
  );
}

/* ---------- Reusable Stat Card ---------- */

function StatCard({
  title,
  value,
  subtitle,
  subtitleColor = "text-gray-500",
  valueColor = "text-gray-900",
}: any) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p
          className={`text-3xl font-bold mt-2 ${valueColor}`}
        >
          {value}
        </p>

        {subtitle && (
          <p
            className={`text-sm mt-2 ${subtitleColor}`}
          >
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
