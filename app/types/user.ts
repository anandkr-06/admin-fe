export type User = {
    id: string;
    email: string;
    role: "ADMIN" | "MANAGER";
    name?: string;
    avatarUrl?:string;
  };
  