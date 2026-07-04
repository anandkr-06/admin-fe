"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  FileText,
  MapPin,
  Car,
  Languages,
} from "lucide-react";
import PersonalDetails from "./sections/PersonalDetails";
import DocumentsSection from "./sections/DocumentsSection";
import ServiceAreasSection from "./sections/ServiceAreasSection";
import TestLocationsSection from "./sections/TestLocationsSection";
import VehiclesSection from "./sections/VehiclesSection";
import AdditionalInformationSection from "./sections/AdditionalInformationSection";

interface Props {
  instructor: any;
}

const tabs = [
  {
    key: "profile",
    label: "Profile",
    icon: User,
  },
  {
    key: "documents",
    label: "Documents",
    icon: FileText,
  },
  {
    key: "serviceAreas",
    label: "Service Areas",
    icon: MapPin,
  },
  {
    key: "testLocations",
    label: "Test Locations",
    icon: MapPin,
  },
  {
    key: "vehicles",
    label: "Vehicles",
    icon: Car,
  },
  {
    key: "additional",
    label: "Additional Information",
    icon: Languages,
  },
];

export default function EditInstructorForm({
  instructor,
}: Props) {
  const [activeTab, setActiveTab] =
    useState("profile");

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Edit Instructor
        </h1>

        <p className="text-gray-500 mt-1">
          Update instructor information
        </p>
      </div>

      <Card>

        <CardContent className="p-6">

          <div className="flex gap-3 flex-wrap">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <Button
                  key={tab.key}
                  variant={
                    activeTab === tab.key
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}

          </div>

        </CardContent>

      </Card>

      <Card>

        <CardContent className="p-8">

          {activeTab === "profile" && (
            <PersonalDetails
              instructorId={instructor._id}
              data={instructor}
              onSuccess={() => {}}
            />
          )}

          {activeTab === "documents" && (
            <DocumentsSection
              instructorId={instructor._id}
              data={instructor}
              onSuccess={() => {}}
            />
          )}

          {activeTab === "serviceAreas" && (
            <ServiceAreasSection
              instructorId={instructor._id}
              data={instructor}
              onSuccess={() => {}}
            />
          )}

          {activeTab === "testLocations" && (
            <TestLocationsSection
              instructorId={instructor._id}
              data={instructor}
              onSuccess={() => {}}
            />
          )}

          {activeTab === "vehicles" && (
            <VehiclesSection
              instructorId={instructor._id}
              data={instructor}
              onSuccess={() => {}}
            />
          )}

          {activeTab === "additional" && (
            <AdditionalInformationSection
              instructorId={instructor._id}
              data={instructor}
              onSuccess={() => {}}
            />
          )}

        </CardContent>

      </Card>

    </div>
  );
}