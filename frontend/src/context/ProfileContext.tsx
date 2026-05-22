import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { userService } from "../services/user.service";
import { authService } from "../services/auth.service";

export interface UserProfile {
  accountId: number;
  email: string;
  role: "user" | "company";

  // Job Seeker
  userId?: number;
  firstName?: string;
  lastName?: string;
  gender?: string;
  avatar?: string | null;
  resume?: string | null;
  phoneNumber?: string;
  bio?: string | null;

  // Company
  companyId?: number;
  companyName?: string;
  logo?: string | null;
  type?: string | null;
  description?: string | null;
}

export interface JobPost {
  id: number;
  jobtitle: string;
  location: string;
  requirements: string;
  Salary: number;
  description: string | null;
  companyId: number;
  createdAt: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  posts: JobPost[];
  setPosts: (posts: JobPost[]) => void;
  loading: boolean;
  refetchProfile: () => Promise<void>;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

// TODO: remove this DEV-only fallback when login/auth is complete enough for local testing.
const DEVELOPMENT_FALLBACK_JOB_PROFILE: UserProfile = {
  accountId: 1,
  userId: 3,
  role: "user",
  email: "Alya@example.com",
  firstName: "Alya",
  lastName: "Chan",
};

// TODO: remove this DEV-only fallback when login/auth is complete enough for local testing.
const DEVELOPMENT_FALLBACK_COMPANY_PROFILE: UserProfile = {
  accountId: 1,
  companyId: 2,
  role: "company",
  email: "pure@gmail.com",
  companyName: "Pure",
};

function getDevelopmentFallbackProfile(): UserProfile {
  const pathname = window.location.pathname.toLowerCase();
  const isCompanyPage =
    pathname.startsWith("/com") || pathname.includes("company-acceptance");

  return isCompanyPage
    ? DEVELOPMENT_FALLBACK_COMPANY_PROFILE
    : DEVELOPMENT_FALLBACK_JOB_PROFILE;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const stored = authService.getStoredUser();

    if (import.meta.env.DEV && !authService.isLoggedIn()) {
      return getDevelopmentFallbackProfile();
    }

    if (stored) {
      return stored;
    }

    return null;
  });
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    if (!authService.isLoggedIn()) {
      if (import.meta.env.DEV) {
        setProfileState(getDevelopmentFallbackProfile());
        setLoading(false);
        return;
      }

      setLoading(false);
      setProfileState(null);
      return;
    }

    setLoading(true);
    try {
      const user = await userService.getProfile();
      setProfileState(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to fetch profile:", error);

      if (import.meta.env.DEV) {
        setProfileState(getDevelopmentFallbackProfile());
      } else {
        setProfileState(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  function setProfile(p: UserProfile) {
    setProfileState(p);
    localStorage.setItem("user", JSON.stringify(p));
  }

  function logout() {
    authService.logout();
    setProfileState(null);
    setPosts([]);
    localStorage.removeItem("user");
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        posts,
        setPosts,
        loading,
        refetchProfile: fetchProfile,
        logout,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
