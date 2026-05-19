import { Request, Response, NextFunction } from "express"
import bcrypt from 'bcryptjs';
import { prisma } from "../../../db";

//GET /api/company
export async function getCompanyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const company = await prisma.company.findUnique({
            where: { id: req.user!.accountId},
            select: { id: true, companyName: true, logo: true, type: true, phoneNumber: true, description: true, createdAt: true, updatedAt: true },
        });

        if (!company) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

    } catch (err) {
        next(err);
    }
}

//GET /api/company/:id
export async function getCompanyProfileById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = req.params.id;

        const company = await prisma.company.findUnique({
            where: { id },
            select: { id: true, companyName: true, logo: true, type: true, phoneNumber: true, description: true, createdAt: true, updatedAt: true },
        });

        if (!company) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

    } catch (err) {
        next(err);
    }
}

//PATCH /api/company
export async function updateCompanyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id, companyName, type, phoneNumber, description } = req.body;

    let logo: string | undefined;

    // if (req.file) {
    //   const currentUser = await prisma.user.findUnique({
    //     where: { id: req.company!.id },
    //     select: { logo: true },
    //   });
    //   if (currentUser?.avatar) {
    //     await deleteFromCloudinary(currentUser.avatar);
    //   }

    //   avatar = await uploadToCloudinary(req.file.buffer, "avatars");
    // }

    const company = await prisma.company.update({
      where: { id: req.user!.accountId },
      data: {
        ...(companyName && { companyName }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(phoneNumber && { phoneNumber }),
        ...(logo && { logo }),
      },
      select: {
        id: true, companyName: true, type: true, phoneNumber: true, logo: true, description: true, updatedAt: true,
      },
    });

    res.json({ message: 'Profile updated.', company });
  } catch (err) {
    next(err);
  }
}