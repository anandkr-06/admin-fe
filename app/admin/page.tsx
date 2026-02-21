"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card><CardContent className="p-4">Instructors</CardContent></Card>
      <Card><CardContent className="p-4">Learners</CardContent></Card>
      <Card><CardContent className="p-4">Courses</CardContent></Card>
      <Card><CardContent className="p-4">Orders</CardContent></Card>
    </div>
  );
}