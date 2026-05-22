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
  const [user, company, post] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    }),
    prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true },
    }),
    prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, companyId: true },
    }),
  ]);

  if (!user) {
    throw new Error(`Job seeker userId ${userId} does not exist`);
  }

  if (!company) {
    throw new Error(`Company companyId ${companyId} does not exist`);
  }

  if (!post) {
    throw new Error(`Job post postId ${postId} does not exist`);
  }

  if (post.companyId !== companyId) {
    throw new Error(`Job post ${postId} does not belong to company ${companyId}`);
  }

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
      companyhire: {
        select: {
          id: true,
          companyName: true,
          logo: true,
          email: true,
        },
      },
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteApplication = async (applyId: number) => {
  const application = await prisma.apply.findUnique({
    where: { id: applyId },
    select: { id: true },
  });

  if (!application) {
    throw new Error(`Application applyId ${applyId} does not exist`);
  }

  return prisma.apply.delete({
    where: { id: applyId },
  });
};

export const getAvailableJobPosts = async () => {
  return prisma.post.findMany({
    select: {
      id: true,
      companyId: true,
      jobtitle: true,
      location: true,
      requirements: true,
      Salary: true,
      description: true,
      createdAt: true,
      company: {
        select: {
          companyName: true,
          logo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
