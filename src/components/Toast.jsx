export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-4 py-3 shadow-lg shadow-pink-700/20 border border-pink-100 text-sm font-semibold text-pink-700">
      {message}
    </div>
  );
}
