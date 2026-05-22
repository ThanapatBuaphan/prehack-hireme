interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl px-8 py-7 w-[90%] max-w-sm flex flex-col items-center gap-5 animate-fade-in">

        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800">Log out?</h3>
          <p className="text-sm text-gray-400 mt-1">Are you sure you want to log out?</p>
        </div>

        <div className="flex gap-3 w-full">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-sm">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}