import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { userService } from "../services/user.service";
import { authService } from "../services/auth.service";

export interface UserProfile {
  accountId: number;
  email: string;
  role: "user" | "company";

  //Job Seeker
  userId?: number;
  firstName?: string;
  lastName?: string;
  gender?: string;
  avatar?: string | null;
  resume?: string | null;
  phoneNumber?: string;
  bio?: string | null;

  //Company
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

// TODO: remove this local development profile when auth/login is the source of truth.
// User id 3 exists in the local development database as a job seeker.
const DEVELOPMENT_FALLBACK_JOB_PROFILE: UserProfile = {
  accountId: 1,
  userId: 3,
  role: "user",
  email: "Alya@example.com",
  firstName: "Alya",
  lastName: "Chan",
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const stored = authService.getStoredUser();

    if (import.meta.env.DEV && !authService.isLoggedIn()) {
      return DEVELOPMENT_FALLBACK_JOB_PROFILE;
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
        setProfileState(DEVELOPMENT_FALLBACK_JOB_PROFILE);
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
        setProfileState(DEVELOPMENT_FALLBACK_JOB_PROFILE);
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
        logout
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
