export interface Location {
  id: number;
  name?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
}

export interface Education {
  id: number;
  schoolName: string;
  grade: string;
  major?: string | null;
  logo?: string | null;
  joinedAt: string;
  endedAt: string;
  createdAt: string;
}

export interface WorkExperience {
  id: number;
  companyName: string;
  role: string;
  workinghere: boolean;
  joinedAt: string;
  endedAt?: string | null;
  createdAt: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  avatar?: string | null;
  resume?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
  location?: Location | null;
  educations: Education[];
  workexperinces: WorkExperience[];
}

export interface CompanyProfile {
  id: number;
  email: string;
  companyName: string;
  logo?: string | null;
  type?: string | null;
  phoneNumber?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  location?: Location | null;
  members: CompanyMember[];
  posts: CompanyPost[];
}

export interface CompanyMember {
  id: number;
  status: string;
  roles: string;
  joinedAt: string;
  endedAt?: string | null;
  user: { id: number; firstName: string; lastName: string; avatar?: string | null };
}

export interface CompanyPost {
  id: number;
  jobtitle: string;
  location: string;
  Salary: number;
  createdAt: string;
}
