import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AppUpdate, Category } from '../types/database';
import { Sparkles, TrendingUp, Clock, ChevronRight, ChefHat } from 'lucide-react';
import { CategoryCardSkeleton, UpdateCardSkeleton } from '../components/common/LoadingSkeleton';

export default function HomePage() {
  const [updates, setUpdates] = useState<AppUpdate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [updatesRes, categoriesRes] = await Promise.all([
        supabase
          .from('app_updates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ]);

      if (updatesRes.data) setUpdates(updatesRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="pb-24 pt-4 sm:pt-6 px-3 sm:px-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>

        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <UpdateCardSkeleton key={i} />
            ))}
          </div>
        </div>

        <div>
          <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 sm:pt-6 px-3 sm:px-4 max-w-6xl mx-auto">
      {updates.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <h2 className="text-lg sm:text-xl font-bold">What's New</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {updates.map((update) => (
              <div
                key={update.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-pink-400 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    {update.type === 'recipe' && <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                    {update.type === 'feature' && <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                    {update.type === 'announcement' && <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">{update.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{update.content}</p>
                    <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(update.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.length === 0 ? (
            <div className="col-span-full text-center py-8 sm:py-12 text-gray-500">
              <p className="text-sm sm:text-base">No categories available yet</p>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">Check back soon for exciting recipes!</p>
            </div>
          ) : (
            categories.map((category, index) => (
              <button
                key={category.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 aspect-square"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="absolute inset-0">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-100 via-pink-100 to-orange-100" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative h-full flex flex-col justify-end p-4">
                  <div className="text-3xl sm:text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon || '🍽️'}
                  </div>
                  <h3 className="font-bold text-white text-base sm:text-lg mb-1 drop-shadow-lg">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/90 line-clamp-2 mb-2 drop-shadow">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-1 text-white/90 text-xs font-medium">
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Featured This Week</h3>
        <p className="text-sm sm:text-base mb-3 sm:mb-4">Discover chef-selected recipes perfect for the season</p>
        <button className="bg-white text-red-500 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors active:scale-95">
          Explore Now
        </button>
      </div>
    </div>
  );
}
