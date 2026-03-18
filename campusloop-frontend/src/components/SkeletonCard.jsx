export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-16 bg-gray-100 rounded-full"></div>
      </div>
      <div className="h-5 w-3/4 bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-4 w-full bg-gray-100 rounded-lg mb-1"></div>
      <div className="h-4 w-2/3 bg-gray-100 rounded-lg mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 bg-gray-100 rounded-full"></div>
        <div className="flex gap-2">
          <div className="h-6 w-12 bg-gray-100 rounded-full"></div>
          <div className="h-6 w-12 bg-gray-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}