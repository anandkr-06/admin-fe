/* eslint-disable react-hooks/error-boundaries */
import { notFound } from "next/navigation";
import EditInstructorForm from "./EditInstructorForm";
import { getInstructorProfile } from "@/services/instructor.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditInstructorPage({
  params,
}: PageProps) {
  const { id } = await params;

  try {
    const instructor = await getInstructorProfile(id);

    if (!instructor) {
      return notFound();
    }
   console.log("🚀 ~ file: page.tsx:22 ~ EditInstructorPage ~ instructor:", instructor);
    return (
      <div className="container mx-auto py-6">
        <EditInstructorForm
          instructor={instructor}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch instructor", error);
    return notFound();
  }
}