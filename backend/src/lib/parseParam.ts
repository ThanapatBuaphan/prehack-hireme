import type { Request, Response } from "express";

export function parseParam(
  req: Request,
  res: Response,
  key: string,
): number | null {
  const raw = Array.isArray(req.params[key]) ? req.params[key][0] : req.params[key];
  const num = parseInt(raw as string, 10);
  if (isNaN(num)) {
    res.status(400).json({ message: `Invalid ${key}.` });
    return null;
  }
  return num;
}
