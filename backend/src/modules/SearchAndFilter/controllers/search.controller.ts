import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db";
import { parseParam } from "../../../lib/parseParam";


export async function searchPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      q,
      location,
      minSalary,
      maxSalary,
      companyId,
      page = "1",
      limit = "10",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (q && q.trim()) {
      where.OR = [
        { jobtitle: { contains: q.trim() } },
        { description: { contains: q.trim() } },
        { requirements: { contains: q.trim() } },
      ];
    }

    // filter location
    if (location && location.trim()) {
      where.location = { contains: location.trim() };
    }

    // filter salary range
    if (minSalary || maxSalary) {
      where.Salary = {
        ...(minSalary && { gte: parseFloat(minSalary) }),
        ...(maxSalary && { lte: parseFloat(maxSalary) }),
      };
    }

    // filter by company
    if (companyId) {
      const cId = parseInt(companyId, 10);
      if (!isNaN(cId)) where.companyId = cId;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          jobtitle: true,
          location: true,
          requirements: true,
          Salary: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          company: {
            select: {
              id: true,
              companyName: true,
              logo: true,
              type: true,
              location: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      posts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/posts/:id
export async function getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseParam(req, res, "id");
    if (id === null) return;

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        jobtitle: true,
        location: true,
        requirements: true,
        Salary: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            type: true,
            phoneNumber: true,
            description: true,
            location: true,
          },
        },
        _count: { select: { applies: true } },
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    res.json({ post });
  } catch (err) {
    next(err);
  }
}
