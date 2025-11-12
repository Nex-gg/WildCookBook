import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  return (
    <div className="pb-24 pt-4 sm:pt-6 px-3 sm:px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Bookmarks</h1>
      <div className="text-center py-12 sm:py-16">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Bookmark className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">No bookmarks yet</h3>
        <p className="text-sm sm:text-base text-gray-600">Start bookmarking your favorite recipes</p>
      </div>
    </div>
  );
}
