function ToastStack({ toasts = [] }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(360px,94vw)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold text-white ${
            toast.type === "success"
              ? "border-emerald-500/50 bg-emerald-700"
              : toast.type === "error"
                ? "border-rose-500/50 bg-rose-700"
                : "border-black/20 bg-ink-900"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
