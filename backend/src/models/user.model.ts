export interface User {
  id: string;
  email: string;
  // Prisma may return null for optional strings
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
