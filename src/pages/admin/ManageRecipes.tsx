import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Recipe } from '../../types/database';
import { ChefHat, ArrowLeft, Edit, Trash2, Eye, EyeOff, Search, Loader2 } from 'lucide-react';

export default function ManageRecipes() {
  const { profile } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    loadRecipes();
  }, [filter]);

  async function loadRecipes() {
    try {
      let query = supabase.from('recipes').select('*').order('created_at', { ascending: false });

      if (filter === 'published') {
        query = query.eq('is_published', true);
      } else if (filter === 'draft') {
        query = query.eq('is_published', false);
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

  async function togglePublish(recipeId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({
          is_published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null,
        })
        .eq('id', recipeId);

      if (error) throw error;
      loadRecipes();
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe');
    }
  }

  async function deleteRecipe(recipeId: string) {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase.from('recipes').delete().eq('id', recipeId);

      if (error) throw error;
      loadRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  }

  function goBack() {
    window.history.back();
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-6xl mx-auto">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Recipes</h1>
        <p className="text-gray-600">View, edit, and manage all recipes</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'published'
                ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'draft'
                ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-400" />
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try a different search term' : 'Create your first recipe to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-video relative">
                {recipe.thumbnail_url ? (
                  <img
                    src={recipe.thumbnail_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-100 via-pink-100 to-orange-100 flex items-center justify-center">
                    <ChefHat className="w-12 h-12 text-red-300" />
                  </div>
                )}
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                    recipe.is_published
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {recipe.is_published ? 'Published' : 'Draft'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {recipe.description || 'No description'}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {recipe.view_count}
                  </span>
                  <span>•</span>
                  <span>{recipe.prep_time + recipe.cook_time}m</span>
                  <span>•</span>
                  <span className="capitalize">{recipe.difficulty}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(recipe.id, recipe.is_published)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
                  >
                    {recipe.is_published ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
