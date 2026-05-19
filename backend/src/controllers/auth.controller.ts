import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from "../db";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../middlewares/auth.js";
import { Account } from '../../generated/prisma/client';

const generateToken = (account: Account, profileId: number): string => {
  const payload: JwtPayload = {
    accountId: account.id,
    role: account.role as "user" | "company",
    profileId,
  };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// POST /auth/register/user
export async function userRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password, confirmPassword, firstName, lastName, gender, phoneNumber } = req.body;
        if (!email || !password || !firstName || !lastName || !gender || !phoneNumber) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        if(password != confirmPassword) {
            res.status(409).json({ error: "Password is not match" });
            return;
        }
        const existingAccount = await prisma.account.findUnique({
            where: { email },
        });
        if (existingAccount) {
            res.status(409).json({ error: "Email already in use" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await prisma.$transaction(async (tx) => {
            const account = await tx.account.create({
                data: { email, password: hashedPassword, role: "user" },
            });
            const user = await tx.user.create({
                data: { email, firstName, lastName, gender, phoneNumber, accountId: account.id, },
            });
                return { account, user };
        });

        const token = generateToken(result.account, result.user.id);
        res.status(201).json({ token, role: "user", profileId: result.user.id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// POST /auth/register/company
export async function companyRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
          const { email, password, companyName } = req.body;
    
          if (!email || !password || !companyName) {
            res.status(400).json({ error: "Missing required fields" });
            return;
          }
    
          const existingAccount = await prisma.account.findUnique({
            where: { email },
          });
          if (existingAccount) {
            res.status(409).json({ error: "Email already in use" });
            return;
          }
    
          const hashedPassword = await bcrypt.hash(password, 10);
    
          const result = await prisma.$transaction(async (tx) => {
            const account = await tx.account.create({
              data: { email, password: hashedPassword, role: "company" },
            });
            const company = await tx.company.create({
              data: {
                email,
                companyName,
                createdAt: new Date(),
                accountId: account.id,
              },
            });
            return { account, company };
          });
    
          const token = generateToken(result.account, result.company.id);
          res
            .status(201)
            .json({ token, role: "company", profileId: result.company.id });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
          const { email, password } = req.body;
    
          if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
          }
    
          const account = await prisma.account.findUnique({
            where: { email },
            include: { user: true, company: true },
          });
    
          if (!account) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
          }
    
          const isMatch = await bcrypt.compare(password, account.password);
          if (!isMatch) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
          }
    
          const profileId =
            account.role === "user" ? account.user?.id : account.company?.id;
    
          if (!profileId) {
            res.status(500).json({ error: "Profile not found" });
            return;
          }
    
          const token = generateToken(account, profileId);
          res.json({ token, role: account.role, profileId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}