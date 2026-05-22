import { Request, Response, NextFunction } from "express"
import { parseParam } from "../../../lib/parseParam";
import { prisma } from "../../../db";
import { uploadToCloudinary, deleteFromCloudinary } from "../../../lib/cloudinary";

function getFile(req: Request, field: string): Express.Multer.File | undefined {
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  return files?.[field]?.[0];
}

// GET /api/company/profile
export async function getCompanyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const company = await prisma.company.findUnique({
        where: { accountId: req.user!.accountId },
        select: {
            id: true, email: true, companyName: true, logo: true, type: true, phoneNumber: true, description: true, createdAt: true, updatedAt: true, location: true,
            members: {
                select: {
                    id: true,
                    status: true,
                    roles: true,
                    joinedAt: true,
                    endedAt: true,
                    user: {
                    select: { id: true, firstName: true, lastName: true, avatar: true },
                    },
                },
            },
        posts: {
          select: { id: true, jobtitle: true, location: true, Salary: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

        if (!company) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        res.json({ company });
    }   catch (err) {
        next(err);
    }
}

// GET /api/company/profile/:id
export async function getCompanyProfileById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const id = parseParam(req, res, "id");
        if (id === null) return;

        const company = await prisma.company.findUnique({
            where: { id },
            select: {
                id: true, email: true, companyName: true, logo: true, type: true, phoneNumber: true, description: true, createdAt: true, updatedAt: true, location: true,
                members: {
                    select: {
                        id: true,
                        status: true,
                        roles: true,
                        joinedAt: true,
                        endedAt: true,
                        user: {
                        select: { id: true, firstName: true, lastName: true, avatar: true },
                        },
                    },
                },
                posts: {
                    select: { id: true, jobtitle: true, location: true, Salary: true, createdAt: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!company) {
            res.status(404).json({ message: 'Company not found.' });
            return;
        }
        
        res.json({ company });
    }   catch (err) {
        next(err);
    }
}

// PATCH /api/company/profile
export async function updateCompanyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { companyName, type, phoneNumber, description } = req.body;
    const logoFile = getFile(req, "logo");

    let logoUrl: string | undefined;
    if (logoFile) {
      const current = await prisma.company.findUnique({
        where: { accountId: req.user!.accountId },
        select: { logo: true },
      });
      if (current?.logo) await deleteFromCloudinary(current.logo);

      logoUrl = await uploadToCloudinary(logoFile.buffer, "company-logos", {
        transformation: [{ width: 400, height: 400, crop: "fill", fetch_format: "webp", quality: "auto" }],
      });
    }

    const company = await prisma.company.update({
      where: { accountId: req.user!.accountId },
      data: {
        ...(companyName && { companyName }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(phoneNumber && { phoneNumber }),
        ...(logoUrl && { logo: logoUrl }),
      },
      select: {
        id: true, companyName: true, type: true, phoneNumber: true,
        logo: true, description: true, updatedAt: true,
      },
    });

    res.json({ message: "Profile updated.", company });
  } catch (err) { next(err); }
}

// POST /api/company/profile/location
export async function upsertCompanyLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, address, city, country, postalCode } = req.body;

    const current = await prisma.company.findUnique({
      where: { accountId: req.user!.accountId },
      select: { locationId: true },
    });
    if (!current) { res.status(404).json({ message: "Company not found." }); return; }

    let location;
    if (current.locationId) {
      location = await prisma.location.update({
        where: { id: current.locationId },
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
      await prisma.company.update({ where: { accountId: req.user!.accountId }, data: { locationId: location.id } });
    }

    res.json({ message: "Location updated.", location });
  } catch (err) { next(err); }
}

// GET /api/company/profile/members
export async function getCompanyMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const company = await prisma.company.findUnique({
      where: { accountId: req.user!.accountId },
      select: { id: true },
    });
    if (!company) { res.status(404).json({ message: "Company not found." }); return; }

    const members = await prisma.companyMembers.findMany({
      where: { companyId: company.id },
      select: {
        id: true, status: true, roles: true, joinedAt: true, endedAt: true, createdAt: true,
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, phoneNumber: true } },
      },
    });

    res.json({ members });
  } catch (err) { next(err); }
}

// POST /api/company/profile/members
export async function addCompanyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, roles, status, joinedAt } = req.body;

    if (!userId || !roles || !joinedAt) {
      res.status(400).json({ message: "Missing required fields: userId, roles, joinedAt." }); return;
    }

    const company = await prisma.company.findUnique({
      where: { accountId: req.user!.accountId },
      select: { id: true },
    });
    if (!company) { res.status(404).json({ message: "Company not found." }); return; }

    const member = await prisma.companyMembers.create({
      data: {
        userId: parseInt(userId),
        companyId: company.id,
        roles,
        status: status ?? "active",
        joinedAt: new Date(joinedAt),
      },
      select: {
        id: true, roles: true, status: true, joinedAt: true,
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.status(201).json({ message: "Member added.", member });
  } catch (err) { next(err); }
}

// PATCH /api/company/profile/members/:memberId
export async function updateCompanyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const memberId = parseParam(req, res, "memberId");
    if (memberId === null) return;

    const company = await prisma.company.findUnique({
      where: { accountId: req.user!.accountId },
      select: { id: true },
    });
    if (!company) { res.status(404).json({ message: "Company not found." }); return; }

    const existing = await prisma.companyMembers.findUnique({ where: { id: memberId } });
    if (!existing || existing.companyId !== company.id) {
      res.status(403).json({ message: "Not authorized to edit this member." }); return;
    }

    const { roles, status, endedAt } = req.body;

    const member = await prisma.companyMembers.update({
      where: { id: memberId },
      data: {
        ...(roles && { roles }),
        ...(status && { status }),
        ...(endedAt !== undefined && { endedAt: endedAt ? new Date(endedAt) : null }),
      },
    });

    res.json({ message: "Member updated.", member });
  } catch (err) { next(err); }
}

// DELETE /api/company/profile/members/:memberId
export async function removeCompanyMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const memberId = parseParam(req, res, "memberId");
    if (memberId === null) return;

    const company = await prisma.company.findUnique({
      where: { accountId: req.user!.accountId },
      select: { id: true },
    });
    if (!company) { res.status(404).json({ message: "Company not found." }); return; }

    const existing = await prisma.companyMembers.findUnique({ where: { id: memberId } });
    if (!existing || existing.companyId !== company.id) {
      res.status(403).json({ message: "Not authorized to remove this member." }); return;
    }

    await prisma.companyMembers.delete({ where: { id: memberId } });
    res.json({ message: "Member removed." });
  } catch (err) { next(err); }
}