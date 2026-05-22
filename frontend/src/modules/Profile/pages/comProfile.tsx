import { useState, useEffect } from "react";
import { useProfile } from "../../../context/ProfileContext";
import { userService } from "../../../services/user.service";
import api from "../../../services/api";
import ProfileBanner from "../components/ProfileBanner";
import PageHeader from "../../../components/PageHeader";
import type { CompanyMember, CompanyPost } from "../types/profile.types";

export default function ComProfile() {
  const { profile, setProfile, loading } = useProfile();

  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [posts, setPosts] = useState<CompanyPost[]>([]);
  const [fullLoading, setFullLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: "", type: "", phoneNumber: "", description: "",
    address: "", city: "", country: "", postalCode: "",
  });
  const [locationText, setLocationText] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const loadFull = async () => {
    setFullLoading(true);
    try {
      const { data } = await api.get("/api/company/profile");
      const c = data.company;
      setMembers(c.members ?? []);
      setPosts(c.posts ?? []);
      const parts = [c.location?.address, c.location?.city, c.location?.postalCode, c.location?.country].filter(Boolean);
      setLocationText(parts.join(", "));
      setForm({
        companyName: c.companyName ?? "",
        type: c.type ?? "",
        phoneNumber: c.phoneNumber ?? "",
        description: c.description ?? "",
        address: c.location?.address ?? "",
        city: c.location?.city ?? "",
        country: c.location?.country ?? "",
        postalCode: c.location?.postalCode ?? "",
      });
    } finally {
      setFullLoading(false);
    }
  };

  useEffect(() => { loadFull(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateCompanyProfile({
        companyName: form.companyName || undefined,
        type: form.type || undefined,
        phoneNumber: form.phoneNumber || undefined,
        description: form.description,
        ...(logoFile && { logo: logoFile }),
      });
      setProfile({ ...profile!, ...updated });

      if (form.address || form.city || form.country) {
        await userService.upsertCompanyLocation({
          address: form.address, city: form.city,
          country: form.country, postalCode: form.postalCode,
        });
      }

      await loadFull();
      setIsEditing(false);
      setLogoFile(null);
      setLogoPreview(null);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLogoFile(null);
    setLogoPreview(null);
    loadFull();
  };

  if (loading || fullLoading) return (
    <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
  );
  if (!profile) return null;

  const email = profile.email ?? "";
  const memberCount = members.length;

  return (
    <div className="flex flex-col h-full min-h-screen bg-white">
      <PageHeader showBack />

      <ProfileBanner
        avatarUrl={logoPreview ?? profile.logo}
        isEditing={isEditing}
        onAvatarChange={(f) => { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }}
      />

      <div className="flex-1 px-4 sm:px-8 pb-6 flex flex-col gap-4 pt-10">

        {isEditing ? (
          <input value={form.companyName}
            onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
            placeholder="Company Name"
            className="border border-gray-300 rounded-full px-3 py-1.5 text-lg font-bold outline-none focus:border-[#515DB6] w-full" />
        ) : (
          <h2 className="text-xl font-bold text-gray-800">{profile.companyName}</h2>
        )}

        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 min-w-[80px]">Size:</span>
            <span className="text-gray-700">{memberCount} employees</span>
          </li>
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
          <li className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 min-w-[80px]">Type:</span>
            {isEditing ? (
              <input value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="Company type"
                className="border border-gray-300 rounded-full px-3 py-1 text-sm flex-1 outline-none focus:border-[#515DB6]" />
            ) : (
              <span className="text-gray-700">{form.type || "—"}</span>
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

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description</span>
          {isEditing ? (
            <textarea value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Company description..." rows={5}
              className="border border-gray-300 rounded-2xl px-4 py-2 text-sm outline-none focus:border-[#515DB6] resize-none w-full" />
          ) : (
            <div className="border border-gray-200 rounded-2xl px-4 py-3 min-h-[80px] text-sm text-gray-600">
              {profile.description || <span className="text-gray-400 italic">No description</span>}
            </div>
          )}
        </div>

        {!isEditing && memberCount > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Team ({memberCount})</span>
            <div className="flex -space-x-2">
              {members.slice(0, 6).map((m) => (
                <div key={m.id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                  title={`${m.user.firstName} ${m.user.lastName}`}>
                  {m.user.avatar
                    ? <img src={m.user.avatar} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">{m.user.firstName[0]}</div>}
                </div>
              ))}
              {memberCount > 6 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                  +{memberCount - 6}
                </div>
              )}
            </div>
          </div>
        )}

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
    </div>
  );
}