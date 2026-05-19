import { Request, Response, NextFunction } from "express"
import bcrypt from 'bcryptjs';
import { prisma } from "../../../db";


//GET /api/user/profile
export async function getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const user = await prisma.user.findUnique({
            where: { id: req.user!.accountId},
            select: { id: true, firstName: true, lastName: true, gender: true, avatar: true, resume: true, phoneNumber: true, bio: true, createdAt: true, updatedAt: true },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

    } catch (err) {
        next(err);
    }
}

//GET /api/user/profile/:id
export async function getUserProfileById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = req.params.id;

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, firstName: true, lastName: true, gender: true, avatar: true, resume: true, phoneNumber: true, bio: true, createdAt: true, updatedAt: true },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

    } catch (err) {
        next(err);
    }
}

//PATCH /api/user/profile
export async function updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id, firstName, lastName, gender, phoneNumber, bio } = req.body;

    let avatar: string | undefined;
    let resume: string | undefined;
    // if (req.file) {
    //   const currentUser = await prisma.user.findUnique({
    //     where: { id: req.user!.id },
    //     select: { avatar: true },
    //   });
    //   if (currentUser?.avatar) {
    //     await deleteFromCloudinary(currentUser.avatar);
    //   }

    //   avatar = await uploadToCloudinary(req.file.buffer, "avatars");
    // }

    const user = await prisma.user.update({
      where: { id: req.user!.accountId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(gender && { gender }),
        ...(bio !== undefined && { bio }),
        ...(phoneNumber && { phoneNumber }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true, firstName: true, lastName: true, gender: true, phoneNumber: true, avatar: true, bio: true, updatedAt: true,
      },
    });

    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    next(err);
  }
}