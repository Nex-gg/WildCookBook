export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
    </div>
  );
}

export function UpdateCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}
