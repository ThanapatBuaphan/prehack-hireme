import { Request, Response } from "express";
import { createApply, getIncomingApplications } from "../models/easyApplication.model";

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
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch applications",
    });
  }
};
