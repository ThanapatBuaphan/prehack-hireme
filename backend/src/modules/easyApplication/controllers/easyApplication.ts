import { Request, Response } from "express";
import {
  createApply,
  deleteApplication,
  getAvailableJobPosts,
  getIncomingApplications,
} from "../models/easyApplication.model";

export const createApplyController = async (req: Request, res: Response) => {
  try {
    const { userId, companyId, postId, message } = req.body;

    if (!userId || !companyId || !postId || !message) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const apply = await createApply(
      Number(userId),
      Number(companyId),
      Number(postId),
      message,
    );

    return res.status(201).json({
      message: "Applied successfully",
      data: apply,
    });
  } catch (error) {
    console.error("Failed to create job application:", {
      body: req.body,
      error,
    });

    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to apply for this job",
    });
  }
};

export const getIncomingApplicationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = Number(req.params.userId);

    const applications = await getIncomingApplications(userId);

    return res.status(200).json({
      message: "Applicatins fetched successfully",
      data: applications,
    });
  } catch (error) {
    console.error("Failed to fetch job seeker applications:", {
      userId: req.params.userId,
      error,
    });

    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch applications",
    });
  }
};

export const deleteApplicationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const applyId = Number(req.params.applyId);

    if (!Number.isInteger(applyId) || applyId <= 0) {
      return res.status(400).json({
        message: "Invalid applyId",
      });
    }

    const application = await deleteApplication(applyId);

    return res.status(200).json({
      message: "Application deleted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Failed to delete job application:", {
      applyId: req.params.applyId,
      error,
    });

    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to delete application",
    });
  }
};

export const getAvailableJobPostsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const posts = await getAvailableJobPosts();

    return res.status(200).json({
      message: "Job posts fetched successfully",
      data: posts.map((post) => ({
        id: post.id,
        companyId: post.companyId,
        companyName: post.company?.companyName ?? "Company",
        logo: post.company?.logo ?? null,
        jobtitle: post.jobtitle,
        location: post.location,
        requirements: post.requirements,
        Salary: post.Salary,
        description: post.description ?? "",
        createdAt: post.createdAt,
      })),
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch job posts",
    });
  }
};
