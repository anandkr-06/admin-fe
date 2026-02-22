"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api.client";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const instructors = await apiFetch("/instructors");
      const learners = await apiFetch("/learners");

      const instructorData = instructors.data.filter(
        (i: any) => !i.isDeleted
      );

      const learnerData = learners.data;

      const activeInstructors = instructorData.filter(
        (i: any) => i.isActive
      ).length;

      const activeLearners = learnerData.filter(
        (l: any) => l.isActive
      ).length;

      const totalWallet = learnerData.reduce(
        (sum: number, l: any) =>
          sum + (l.walletBalance || 0),
        0
      );

      const avgExperience =
        instructorData.reduce(
          (sum: number, i: any) =>
            sum + (i.instructorExperienceYears || 0),
          0
        ) / (instructorData.length || 1);

      setStats({
        totalInstructors: instructorData.length,
        totalLearners: learnerData.length,
        activeInstructors,
        activeLearners,
        totalWallet,
        avgExperience: avgExperience.toFixed(1),
      });
    }

    load();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p>Total Instructors</p>
            <p className="text-3xl font-bold">
              {stats.totalInstructors}
            </p>
            <p className="text-sm text-green-600">
              Active: {stats.activeInstructors}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Total Learners</p>
            <p className="text-3xl font-bold">
              {stats.totalLearners}
            </p>
            <p className="text-sm text-red-600">
              Active: {stats.activeLearners}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Total Wallet Balance</p>
            <p className="text-3xl font-bold text-blue-600">
              ${stats.totalWallet.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Avg Instructor Experience</p>
            <p className="text-3xl font-bold">
              {stats.avgExperience} yrs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
