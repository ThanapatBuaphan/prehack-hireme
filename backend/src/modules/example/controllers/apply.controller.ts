import { Request, Response } from "express";
import { createApply, updateApplyStatus, getIncomingApplicants } from "../models/apply.model";

export const getIncomingApplicantsController = async (req: Request, res: Response) => {
  try {
    const companyId = Number(req.params.companyId);

    const applicants = await getIncomingApplicants(companyId);

    res.status(200).json({
      message: "Applicants fetched successfully",
      data: applicants,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message: "Failed to fetch applicants",
    });
  }
};

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

export const updateApplyStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const applyId = Number(req.params.id);
    const { status } = req.body;

    const updatedApply = await updateApplyStatus(applyId, status);

    return res.status(200).json({
      message: "Application status updated successfully",
      data: updatedApply,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update application status",
    });
  }
};
