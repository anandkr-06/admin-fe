import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}
