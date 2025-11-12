import { useState, useEffect } from 'react';
import { Search, Filter, Clock, Star, ChefHat } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Recipe } from '../types/database';
import { RecipeCardSkeleton } from '../components/common/LoadingSkeleton';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>('newest');

  useEffect(() => {
    loadRecipes();
  }, [sortBy]);

  async function loadRecipes() {
    try {
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true);

      if (sortBy === 'newest') {
        query = query.order('published_at', { ascending: false });
      } else if (sortBy === 'popular') {
        query = query.order('view_count', { ascending: false });
      } else if (sortBy === 'rating') {
        query = query.order('average_rating', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pb-24 pt-4 sm:pt-6 px-3 sm:px-4 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
          <div className="flex gap-3 mb-4">
            <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-10 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 sm:pt-6 px-3 sm:px-4 max-w-6xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Recipes</h1>

        <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <button className="p-2.5 sm:p-3 border rounded-lg sm:rounded-xl hover:bg-gray-50 active:scale-95">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full whitespace-nowrap transition-all active:scale-95 ${
              sortBy === 'newest'
                ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full whitespace-nowrap transition-all active:scale-95 ${
              sortBy === 'popular'
                ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Most Popular
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full whitespace-nowrap transition-all active:scale-95 ${
              sortBy === 'rating'
                ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Highest Rated
          </button>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">No recipes found</h3>
          <p className="text-sm sm:text-base text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Check back soon for delicious recipes!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRecipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-[1.02] cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                {recipe.thumbnail_url ? (
                  <img
                    src={recipe.thumbnail_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-100 via-pink-100 to-orange-100 flex items-center justify-center">
                    <ChefHat className="w-16 h-16 text-red-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold">{recipe.average_rating.toFixed(1)}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 drop-shadow-lg">{recipe.title}</h3>
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium">{recipe.prep_time + recipe.cook_time}m</span>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {recipe.difficulty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
