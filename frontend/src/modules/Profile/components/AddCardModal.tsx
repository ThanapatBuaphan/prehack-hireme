import { useState } from "react";

// Education Modal
interface EduModalProps {
  onClose: () => void;
  onSave: (data: { schoolName: string; grade: string; major: string; joinedAt: string; endedAt: string }) => Promise<void>;
}
export function AddEducationModal({ onClose, onSave }: EduModalProps) {
  const [form, setForm] = useState({ schoolName: "", grade: "", major: "", joinedAt: "", endedAt: "" });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.schoolName || !form.grade || !form.joinedAt || !form.endedAt) return;
    setLoading(true);
    await onSave(form);
    setLoading(false);
    onClose();
  };

  return (
    <Modal title="Add Education" onClose={onClose}>
      <Field label="School Name" value={form.schoolName} onChange={set("schoolName")} />
      <Field label="Degree / Grade" value={form.grade} onChange={set("grade")} />
      <Field label="Major" value={form.major} onChange={set("major")} />
      <Field label="Start Date" value={form.joinedAt} onChange={set("joinedAt")} type="date" />
      <Field label="End Date" value={form.endedAt} onChange={set("endedAt")} type="date" />
      <ModalActions onClose={onClose} onSave={handleSave} loading={loading} />
    </Modal>
  );
}

// Work Experience Modal
interface WorkModalProps {
  onClose: () => void;
  onSave: (data: { companyName: string; role: string; workinghere: boolean; joinedAt: string; endedAt?: string }) => Promise<void>;
}
export function AddWorkModal({ onClose, onSave }: WorkModalProps) {
  const [form, setForm] = useState({ companyName: "", role: "", workinghere: false, joinedAt: "", endedAt: "" });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.companyName || !form.role || !form.joinedAt) return;
    setLoading(true);
    await onSave({ ...form, endedAt: form.workinghere ? undefined : form.endedAt });
    setLoading(false);
    onClose();
  };

  return (
    <Modal title="Add Work Experience" onClose={onClose}>
      <Field label="Company" value={form.companyName} onChange={(v) => set("companyName")(v)} />
      <Field label="Role / Position" value={form.role} onChange={(v) => set("role")(v)} />
      <Field label="Start Date" value={form.joinedAt} onChange={(v) => set("joinedAt")(v)} type="date" />
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={form.workinghere} onChange={(e) => set("workinghere")(e.target.checked)} />
        Currently working here
      </label>
      {!form.workinghere && (
        <Field label="End Date" value={form.endedAt} onChange={(v) => set("endedAt")(v)} type="date" />
      )}
      <ModalActions onClose={onClose} onSave={handleSave} loading={loading} />
    </Modal>
  );
}

// Shared UI
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-400 uppercase">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-full px-3 py-1.5 text-sm outline-none focus:border-[#515DB6]"
      />
    </div>
  );
}

function ModalActions({ onClose, onSave, loading }: { onClose: () => void; onSave: () => void; loading: boolean }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button onClick={onClose} className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
      <button onClick={onSave} disabled={loading} className="px-4 py-2 rounded-full bg-[#515DB6] text-white text-sm hover:bg-[#3D3B8E] disabled:opacity-50">
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
