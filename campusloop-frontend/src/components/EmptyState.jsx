export default function EmptyState({ title, subtitle, emoji = "📭" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="text-gray-700 font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs">{subtitle}</p>
    </div>
  );
}