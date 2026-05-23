import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../../../context/ProfileContext";
import { userService } from "../../../services/user.service";
import api, { publicApi } from "../../../services/api";
import ProfileBanner from "../components/ProfileBanner";
import PageHeader from "../../../components/PageHeader";
import type { CompanyMember } from "../types/profile.types";

export default function ComProfile() {
  const { id } = useParams<{ id: string }>();
  const { profile: myProfile, setProfile, loading: ctxLoading } = useProfile();

  const isOwner = id === "me" || String(myProfile?.companyId) === id;

  const [data, setData] = useState<any>(null);
  const [members, setMembers] = useState<CompanyMember[]>([]);
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
      const url = isOwner ? "/api/company/profile" : `/api/company/profile/${id}`;
      const { data: res } = await (isOwner ? api : publicApi).get(url);
      const c = res.company;
      setData(c);
      setMembers(c.members ?? []);
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

  useEffect(() => { if (!ctxLoading) loadFull(); }, [id, ctxLoading]);

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
      setProfile({ ...myProfile!, ...updated });
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

  if (ctxLoading || fullLoading) return (
    <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
  );
  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-gray-400">
      <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
      <p className="text-xl font-bold text-gray-600">Profile not found</p>
      <p className="text-sm">The profile you are looking for does not exist.</p>
    </div>
  );

  const email = data.email ?? "";
  const memberCount = members.length;

  return (
    <div className="flex flex-col h-full min-h-screen bg-white">
      <PageHeader showBack={!isOwner} />
      <ProfileBanner
        avatarUrl={logoPreview ?? data.logo}
        isEditing={isEditing && isOwner}
        onAvatarChange={(f) => { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }}
      />

      <div className="flex-1 px-4 sm:px-8 pb-6 flex flex-col gap-4 pt-10">
        {isEditing && isOwner ? (
          <input value={form.companyName}
            onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
            placeholder="Company Name"
            className="border border-gray-300 rounded-full px-3 py-1.5 text-lg font-bold outline-none focus:border-[#515DB6] w-full" />
        ) : (
          <h2 className="text-xl font-bold text-gray-800">{data.companyName}</h2>
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
            {isEditing && isOwner ? (
              <input value={form.phoneNumber} onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                placeholder="Phone number"
                className="border border-gray-300 rounded-full px-3 py-1 text-sm flex-1 outline-none focus:border-[#515DB6]" />
            ) : (
              <span className="text-gray-700">{form.phoneNumber || "—"}</span>
            )}
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 min-w-[80px]">Type:</span>
            {isEditing && isOwner ? (
              <input value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="Company type"
                className="border border-gray-300 rounded-full px-3 py-1 text-sm flex-1 outline-none focus:border-[#515DB6]" />
            ) : (
              <span className="text-gray-700">{form.type || "—"}</span>
            )}
          </li>
          {isEditing && isOwner ? (
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
          {isEditing && isOwner ? (
            <textarea value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Company description..." rows={5}
              className="border border-gray-300 rounded-2xl px-4 py-2 text-sm outline-none focus:border-[#515DB6] resize-none w-full" />
          ) : (
            <div className="border border-gray-200 rounded-2xl px-4 py-3 min-h-[80px] text-sm text-gray-600">
              {data.description || <span className="text-gray-400 italic">No description</span>}
            </div>
          )}
        </div>

        {memberCount > 0 && (
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

        {isOwner && (
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
        )}
      </div>
    </div>
  );
}
