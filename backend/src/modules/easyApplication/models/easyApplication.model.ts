import { prisma } from "../../../db";

export interface ApplyModel {
  id: number;

  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;

  userId: number;
  companyId: number;
  postId: number;

  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatar?: string | null;
    resume?: string | null;
    bio?: string | null;
  };

  company?: {
    id: number;
    companyName: string;
    logo?: string | null;
    email: string;
  };

  post?: {
    id: number;
    jobtitle: string;
    location: string;
    requirements: string;
    Salary: number;
    description?: string | null;
    createdAt: string;
  };
}

export const createApply = async (
  userId: number,
  companyId: number,
  postId: number,
  message: string,
) => {
  const existingApply = await prisma.apply.findFirst({
    where: {
      userId,
      postId,
    },
  });

  if (existingApply) {
    throw new Error("You already applied to this job");
  }

  return prisma.apply.create({
    data: {
      userId,
      companyId,
      postId,
      message,
      status: "pending",
    },
  });
};

export const getIncomingApplications = async (userId: number) => {
  return prisma.apply.findMany({
    where: {
      userId,
    },
    include: {
      companyhire: true,
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
