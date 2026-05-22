interface Props {
  avatarUrl?: string | null;
  isEditing?: boolean;
  onAvatarChange?: (file: File) => void;
  bannerColor?: string;
}

export default function ProfileBanner({
  avatarUrl,
  isEditing = false,
  onAvatarChange,
  bannerColor = "bg-[#3D3B8E]",
}: Props) {
  return (
    <div className="relative shrink-0">
      <div className={`${bannerColor} h-24 sm:h-28 w-full`} />

      <div className="absolute left-6 bottom-0 translate-y-1/2">
        <label className={isEditing ? "cursor-pointer" : ""}>
          <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-200 overflow-hidden relative flex items-center justify-center shadow">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
            )}
          </div>
          {isEditing && (
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f && onAvatarChange) onAvatarChange(f); }} />
          )}
        </label>
      </div>
    </div>
  );
}