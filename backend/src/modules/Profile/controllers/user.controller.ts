import { Request, Response, NextFunction } from "express"
import { prisma } from "../../../db";
import { parseParam } from "../../../lib/parseParam";
import { uploadToCloudinary, deleteFromCloudinary } from "../../../lib/cloudinary";

function getFile(req: Request, field: string): Express.Multer.File | undefined {
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  return files?.[field]?.[0];
}


//GET /api/user/profile
export async function getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const user = await prisma.user.findUnique({
            where: { accountId: req.user!.accountId },
            select: { id: true, firstName: true, lastName: true, gender: true, avatar: true, resume: true, phoneNumber: true, bio: true, createdAt: true, updatedAt: true, location: true,

                educations: {
                    select: { id: true, schoolName: true, grade: true, major: true, logo: true, joinedAt: true, endedAt: true, createdAt: true },
                    orderBy: { joinedAt: "desc" },
                },

                workexperinces: {
                    select: { id: true, companyName: true, role: true, workinghere: true, joinedAt: true, endedAt: true, createdAt: true },
                    orderBy: { joinedAt: "desc" },
                },
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.json({ user });
    }   catch (err) {
        next(err);
    }
}

//GET /api/user/profile/:id
export async function getUserProfileById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = parseParam(req, res, "id");
        if (id === null) return;

       const user = await prisma.user.findUnique({
            where: { accountId: req.user!.accountId },
            select: { id: true, firstName: true, lastName: true, gender: true, avatar: true, resume: true, phoneNumber: true, bio: true, createdAt: true, updatedAt: true, location: true,

                educations: {
                    select: { id: true, schoolName: true, grade: true, major: true, logo: true, joinedAt: true, endedAt: true, createdAt: true },
                    orderBy: { joinedAt: "desc" },
                },

                workexperinces: {
                    select: { id: true, companyName: true, role: true, workinghere: true, joinedAt: true, endedAt: true, createdAt: true },
                    orderBy: { joinedAt: "desc" },
                },
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.json({ user });
    }   catch (err) {
        next(err);
    }
}

// PATCH /api/user/profile
export async function updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { firstName, lastName, gender, phoneNumber, bio } = req.body;

    const avatarFile = getFile(req, "avatar");
    const resumeFile = getFile(req, "resume");

    let currentUser: { avatar: string | null; resume: string | null } | null = null;
    if (avatarFile || resumeFile) {
      currentUser = await prisma.user.findUnique({
        where: { accountId: req.user!.accountId },
        select: { avatar: true, resume: true },
      });
    }

    const [avatarUrl, resumeUrl] = await Promise.all([
      avatarFile
        ? (currentUser?.avatar && deleteFromCloudinary(currentUser.avatar),
           uploadToCloudinary(avatarFile.buffer, "avatars", {
             transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face", fetch_format: "webp", quality: "auto" }],
           }))
        : Promise.resolve(undefined),
      resumeFile
        ? (currentUser?.resume && deleteFromCloudinary(currentUser.resume),
           uploadToCloudinary(resumeFile.buffer, "resumes", { resource_type: "raw", format: "pdf" }))
        : Promise.resolve(undefined),
    ]);

    const user = await prisma.user.update({
      where: { accountId: req.user!.accountId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(gender && { gender }),
        ...(bio !== undefined && { bio }),
        ...(phoneNumber && { phoneNumber }),
        ...(avatarUrl && { avatar: avatarUrl }),
        ...(resumeUrl && { resume: resumeUrl }),
      },
      select: {
        id: true, firstName: true, lastName: true, gender: true,
        phoneNumber: true, avatar: true, resume: true, bio: true, updatedAt: true,
      },
    });

    res.json({ message: "Profile updated.", user });
  } catch (err) { next(err); }
}

// POST /api/user/profile/location
export async function upsertUserLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, address, city, country, postalCode } = req.body;

    const currentUser = await prisma.user.findUnique({
      where: { accountId: req.user!.accountId },
      select: { locationId: true },
    });
    if (!currentUser) { res.status(404).json({ message: "User not found." }); return; }

    let location;
    if (currentUser.locationId) {
      location = await prisma.location.update({
        where: { id: currentUser.locationId },
        data: {
          ...(name !== undefined && { name }),
          ...(address !== undefined && { address }),
          ...(city !== undefined && { city }),
          ...(country !== undefined && { country }),
          ...(postalCode !== undefined && { postalCode }),
        },
      });
    } else {
      location = await prisma.location.create({ data: { name, address, city, country, postalCode } });
      await prisma.user.update({ where: { accountId: req.user!.accountId }, data: { locationId: location.id } });
    }

    res.json({ message: "Location updated.", location });
  } catch (err) { next(err); }
}

// POST /api/user/profile/education
export async function addEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { schoolName, grade, major, logo, joinedAt, endedAt } = req.body;

    if (!schoolName || !grade || !joinedAt || !endedAt) {
      res.status(400).json({ message: "Missing required fields: schoolName, grade, joinedAt, endedAt." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { accountId: req.user!.accountId }, select: { id: true } });
    if (!user) { res.status(404).json({ message: "User not found." }); return; }

    const education = await prisma.education.create({
      data: { userId: user.id, schoolName, grade, major, logo, joinedAt: new Date(joinedAt), endedAt: new Date(endedAt) },
    });

    res.status(201).json({ message: "Education added.", education });
  } catch (err) { next(err); }
}

// PATCH /api/user/profile/education/:educationId
export async function updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const educationId = parseParam(req, res, "educationId");
    if (educationId === null) return;

    const user = await prisma.user.findUnique({ where: { accountId: req.user!.accountId }, select: { id: true } });
    if (!user) { res.status(404).json({ message: "User not found." }); return; }

    const existing = await prisma.education.findUnique({ where: { id: educationId } });
    if (!existing || existing.userId !== user.id) {
      res.status(403).json({ message: "Not authorized to edit this education." }); return;
    }

    const { schoolName, grade, major, logo, joinedAt, endedAt } = req.body;

    const education = await prisma.education.update({
      where: { id: educationId },
      data: {
        ...(schoolName && { schoolName }),
        ...(grade && { grade }),
        ...(major !== undefined && { major }),
        ...(logo !== undefined && { logo }),
        ...(joinedAt && { joinedAt: new Date(joinedAt) }),
        ...(endedAt && { endedAt: new Date(endedAt) }),
      },
    });

    res.json({ message: "Education updated.", education });
  } catch (err) { next(err); }
}

// DELETE /api/user/profile/education/:educationId
export async function deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const educationId = parseParam(req, res, "educationId");
    if (educationId === null) return;

    const user = await prisma.user.findUnique({ where: { accountId: req.user!.accountId }, select: { id: true } });
    if (!user) { res.status(404).json({ message: "User not found." }); return; }

    const existing = await prisma.education.findUnique({ where: { id: educationId } });
    if (!existing || existing.userId !== user.id) {
      res.status(403).json({ message: "Not authorized to delete this education." }); return;
    }

    await prisma.education.delete({ where: { id: educationId } });
    res.json({ message: "Education deleted." });
  } catch (err) { next(err); }
}

// POST /api/user/profile/work-experience
export async function addWorkExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { companyName, role, workinghere, joinedAt, endedAt } = req.body;

    if (!companyName || !role || !joinedAt) {
      res.status(400).json({ message: "Missing required fields: companyName, role, joinedAt." }); return;
    }

    const user = await prisma.user.findUnique({ where: { accountId: req.user!.accountId }, select: { id: true } });
    if (!user) { res.status(404).json({ message: "User not found." }); return; }

    const workExp = await prisma.workExperience.create({
      data: {
        userId: user.id, companyName, role,
        workinghere: workinghere === "true" || workinghere === true,
        joinedAt: new Date(joinedAt),
        endedAt: endedAt ? new Date(endedAt) : null,
      },
    });

    res.status(201).json({ message: "Work experience added.", workExperience: workExp });
  } catch (err) { next(err); }
}

// PATCH /api/user/profile/work-experience/:workExpId
export async function updateWorkExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const workExpId = parseParam(req, res, "workExpId");
    if (workExpId === null) return;

    const user = await prisma.user.findUnique({ where: { accountId: req.user!.accountId }, select: { id: true } });
    if (!user) { res.status(404).json({ message: "User not found." }); return; }

    const existing = await prisma.workExperience.findUnique({ where: { id: workExpId } });
    if (!existing || existing.userId !== user.id) {
      res.status(403).json({ message: "Not authorized to edit this work experience." }); return;
    }

    const { companyName, role, workinghere, joinedAt, endedAt } = req.body;

    const workExp = await prisma.workExperience.update({
      where: { id: workExpId },
      data: {
        ...(companyName && { companyName }),
        ...(role && { role }),
        ...(workinghere !== undefined && { workinghere: workinghere === "true" || workinghere === true }),
        ...(joinedAt && { joinedAt: new Date(joinedAt) }),
        ...(endedAt !== undefined && { endedAt: endedAt ? new Date(endedAt) : null }),
      },
    });

    res.json({ message: "Work experience updated.", workExperience: workExp });
  } catch (err) { next(err); }
}

// DELETE /api/user/profile/work-experience/:workExpId
export async function deleteWorkExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const workExpId = parseParam(req, res, "workExpId");
    if (workExpId === null) return;

    const user = await prisma.user.findUnique({ where: { accountId: req.user!.accountId }, select: { id: true } });
    if (!user) { res.status(404).json({ message: "User not found." }); return; }

    const existing = await prisma.workExperience.findUnique({ where: { id: workExpId } });
    if (!existing || existing.userId !== user.id) {
      res.status(403).json({ message: "Not authorized to delete this work experience." }); return;
    }

    await prisma.workExperience.delete({ where: { id: workExpId } });
    res.json({ message: "Work experience deleted." });
  } catch (err) { next(err); }
}