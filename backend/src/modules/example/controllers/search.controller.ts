import { Request, Response } from 'express';
import { prisma } from '../../../db'

function buildWhereClause(filters: any) {
  return {
    isActive: true,

    // Keyword search across multiple fields
    ...(filters.keyword && {
      OR: [
        { user: { firstName:   { contains: filters.keyword } } },
        { user: { lastName:    { contains: filters.keyword } } },
        { user: { dormAddress: { contains: filters.keyword } } },
        { description:         { contains: filters.keyword } },
      ],
    }),

    // Gender filter
    ...(filters.gender !== 'All' && {
      user: { gender: filters.gender }
    }),

    // Rent range
    ...((filters.minRent || filters.maxRent) && {
      user: {
        monthlyRent: {
          ...(filters.minRent && { gte: filters.minRent }),
          ...(filters.maxRent && { lte: filters.maxRent }),
        }
      }
    }),
  };
}

function buildOrderBy(filters: any) {
  const sortMap: Record<string, any> = {
    name: { user: { firstName: filters.sortOrder } },
    id:   { user: { studentId: filters.sortOrder } },
    rent: { user: { monthlyRent: filters.sortOrder } },
  };
  return sortMap[filters.sortType ?? ''] ?? { id: 'asc' };
}

export class SearchController {
  static async search(req: Request, res: Response) {
    try {
      // 1. Parse filters
      const filters = {
        keyword:   (req.query.q as string)?.trim() || null,
        gender:    (req.query.gender as string) || 'All',
        sortType:  ['name', 'id', 'rent'].includes(req.query.sortType as string)
                     ? (req.query.sortType as string) : null,
        sortOrder: req.query.sortOrder === 'desc' ? 'desc' : 'asc',
        minRent:   req.query.minRent ? Number(req.query.minRent) : null,
        maxRent:   req.query.maxRent ? Number(req.query.maxRent) : null,
        page:      Math.max(1, Number(req.query.page) || 1),
        limit:     Math.min(20, Number(req.query.limit) || 10),
      };

      const where   = buildWhereClause(filters);
      const orderBy = buildOrderBy(filters);
      const offset  = (filters.page - 1) * filters.limit;

      // 2. Run data + count in parallel
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          orderBy,
          skip:  offset,
          take:  filters.limit,
          include: {
            user: {
              select: {
                firstName:   true,
                lastName:    true,
                studentId:   true,
                gender:      true,
                dormAddress: true,
                monthlyRent: true,
              }
            }
          }
        }),
        prisma.post.count({ where }),
      ]);

      // 3. Shape response to match what your frontend expects
      const data = posts.map(post => ({
        postId:       post.id,
        description:  post.description,
        image:        post.image,
        firstName:    post.user.firstName,
        lastName:     post.user.lastName,
        studentId:    post.user.studentId,
        gender:       post.user.gender,
        dormAddress:  post.user.dormAddress,
        monthlyRent:  post.user.monthlyRent,
      }));

      res.json({
        data,
        pagination: {
          page:        filters.page,
          limit:       filters.limit,
          total,
          total_pages: Math.ceil(total / filters.limit),
        },
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Search failed' });
    }
  }
}