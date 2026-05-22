import { useState, useEffect, useRef } from "react";
import { useProfile } from "../../../context/ProfileContext";
import { userService } from "../../../services/user.service";
import api from "../../../services/api";
import ProfileBanner from "../components/ProfileBanner";
import CardSection from "../components/CardSection";
import { AddEducationModal, AddWorkModal } from "../components/AddCardModal";
import type { Education, WorkExperience } from "../types/profile.types";
import PageHeader from "../../../components/PageHeader";

export default function JobProfile() {
  const { profile, setProfile, loading } = useProfile();

  const [educations, setEducations] = useState<Education[]>([]);
  const [workExps, setWorkExps] = useState<WorkExperience[]>([]);
  const [fullLoading, setFullLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phoneNumber: "", bio: "",
    address: "", city: "", country: "", postalCode: "",
  });
  const [locationText, setLocationText] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [showEduModal, setShowEduModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const loadFull = async () => {
    setFullLoading(true);
    try {
      const { data } = await api.get("/api/user/profile");
      const u = data.user;
      setEducations(u.educations ?? []);
      setWorkExps(u.workexperinces ?? []);
      const parts = [u.location?.address, u.location?.city, u.location?.postalCode, u.location?.country].filter(Boolean);
      setLocationText(parts.join(", "));
      setForm({
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        phoneNumber: u.phoneNumber ?? "",
        bio: u.bio ?? "",
        address: u.location?.address ?? "",
        city: u.location?.city ?? "",
        country: u.location?.country ?? "",
        postalCode: u.location?.postalCode ?? "",
      });
    } finally {
      setFullLoading(false);
    }
  };

  useEffect(() => { loadFull(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateUserProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber || undefined,
        bio: form.bio || undefined,
        ...(avatarFile && { avatar: avatarFile }),
        ...(resumeFile && { resume: resumeFile }),
      });
      setProfile({ ...profile!, ...updated });
      await userService.upsertUserLocation({
        address: form.address, city: form.city,
        country: form.country, postalCode: form.postalCode,
      });
      await loadFull();
      setIsEditing(false);
      setAvatarFile(null);
      setResumeFile(null);
      setAvatarPreview(null);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setResumeFile(null);
    setAvatarPreview(null);
    loadFull();
  };

  if (loading || fullLoading) return (
    <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
  );
  if (!profile) return null;

  const email = profile.email ?? "";

  return (
    <div className="flex flex-col h-full min-h-screen bg-white">
      <PageHeader />
      <ProfileBanner
        avatarUrl={avatarPreview ?? profile.avatar}
        isEditing={isEditing}
        onAvatarChange={(f) => { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }}
      />

      <div className="flex-1 px-4 sm:px-8 pb-6 flex flex-col gap-4 pt-10">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              placeholder="First name"
              className="border border-gray-300 rounded-full px-3 py-1.5 text-sm flex-1 outline-none focus:border-[#515DB6]" />
            <input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              placeholder="Last name"
              className="border border-gray-300 rounded-full px-3 py-1.5 text-sm flex-1 outline-none focus:border-[#515DB6]" />
          </div>
        ) : (
          <h2 className="text-xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h2>
        )}

        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-500 min-w-[80px]">Email:</span>
            <a href={`mailto:${email}`} className="text-[#515DB6] underline break-all">{email || "—"}</a>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 min-w-[80px]">Phone:</span>
            {isEditing ? (
              <input value={form.phoneNumber} onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                placeholder="Phone number"
                className="border border-gray-300 rounded-full px-3 py-1 text-sm flex-1 outline-none focus:border-[#515DB6]" />
            ) : (
              <span className="text-gray-700">{form.phoneNumber || "—"}</span>
            )}
          </li>
          {isEditing ? (
            <>
              {[
                { label: "Address", key: "address", placeholder: "Street address" },
                { label: "City", key: "city", placeholder: "City" },
                { label: "Zip Code", key: "postalCode", placeholder: "Postal code" },
                { label: "Country", key: "country", placeholder: "Country" },
              ].map(({ label, key, placeholder }) => (
                <li key={key} className="flex items-center gap-2">
                  <span className="font-semibold text-gray-500 min-w-[80px]">{label}:</span>
                  <input value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="border border-gray-300 rounded-full px-3 py-1 text-sm flex-1 outline-none focus:border-[#515DB6]" />
                </li>
              ))}
            </>
          ) : (
            <li className="flex items-start gap-2">
              <span className="font-semibold text-gray-500 min-w-[80px]">Address:</span>
              <span className="text-gray-700">{locationText || "—"}</span>
            </li>
          )}
        </ul>

        {isEditing ? (
          <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Bio..." rows={3}
            className="border border-gray-300 rounded-2xl px-4 py-2 text-sm outline-none focus:border-[#515DB6] resize-none w-full" />
        ) : form.bio ? (
          <p className="text-sm text-gray-500">{form.bio}</p>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Education</span>
              {isEditing && <button onClick={() => setShowEduModal(true)} className="text-xs text-[#515DB6] hover:underline">+ Add</button>}
            </div>
            {educations.length === 0 && <p className="text-xs text-gray-400 italic">No education added</p>}
            {educations.map((edu) => (
              <CardSection key={edu.id} onDelete={isEditing ? () => userService.deleteEducation(edu.id).then(loadFull) : undefined}>
                <p className="text-sm font-semibold text-gray-700">{edu.schoolName}</p>
                <p className="text-xs text-gray-500">{edu.grade}{edu.major ? `, ${edu.major}` : ""}</p>
                <p className="text-xs text-gray-400">{new Date(edu.joinedAt).getFullYear()} – {new Date(edu.endedAt).getFullYear()}</p>
              </CardSection>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Work Experience</span>
              {isEditing && <button onClick={() => setShowWorkModal(true)} className="text-xs text-[#515DB6] hover:underline">+ Add</button>}
            </div>
            {workExps.length === 0 && <p className="text-xs text-gray-400 italic">No experience added</p>}
            {workExps.map((w) => (
              <CardSection key={w.id} onDelete={isEditing ? () => userService.deleteWorkExperience(w.id).then(loadFull) : undefined}>
                <p className="text-sm font-semibold text-gray-700">{w.companyName}</p>
                <p className="text-xs text-gray-500">{w.role}</p>
                <p className="text-xs text-gray-400">{new Date(w.joinedAt).getFullYear()} – {w.workinghere ? "Present" : w.endedAt ? new Date(w.endedAt).getFullYear() : ""}</p>
              </CardSection>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Resume</span>
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-3">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex-1 text-sm min-w-0">
              {resumeFile
                ? <span className="text-gray-700 truncate block">{resumeFile.name}</span>
                : profile.resume
                ? <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="text-[#515DB6] underline">Resume.pdf</a>
                : <span className="text-gray-400 italic">No resume uploaded</span>}
              <p className="text-xs text-gray-400">PDF (Max 10MB)</p>
            </div>
            {isEditing && (
              <>
                <button onClick={() => resumeInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#515DB6] text-[#515DB6] hover:bg-[#515DB6]/5 shrink-0">
                  Upload File
                </button>
                <input ref={resumeInputRef} type="file" accept="application/pdf" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setResumeFile(f); }} />
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {isEditing ? (
            <>
              <button onClick={handleCancel}
                className="px-5 py-2 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 rounded-full bg-[#515DB6] text-white text-sm hover:bg-[#3D3B8E] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}
              className="px-5 py-2 rounded-full border border-[#515DB6] text-[#515DB6] text-sm hover:bg-[#515DB6]/5">Edit</button>
          )}
        </div>
      </div>

      {showEduModal && (
        <AddEducationModal onClose={() => setShowEduModal(false)}
          onSave={async (data) => { await userService.addEducation(data); await loadFull(); }} />
      )}
      {showWorkModal && (
        <AddWorkModal onClose={() => setShowWorkModal(false)}
          onSave={async (data) => { await userService.addWorkExperience(data); await loadFull(); }} />
      )}
    </div>
  );
}