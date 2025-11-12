import { useAuth } from '../../contexts/AuthContext';
import { ChefHat, Plus, List, FolderOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from '../../lib/navigation';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  function goToProfile() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-6xl mx-auto">
      <button
        onClick={goToProfile}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Profile
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage recipes and categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/admin/recipes/new')}
          className="group bg-gradient-to-br from-red-400 to-pink-400 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Create Recipe</h3>
          <p className="text-white/90 text-sm">Add a new recipe to the platform</p>
        </button>

        <button
          onClick={() => navigate('/admin/recipes')}
          className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <List className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Manage Recipes</h3>
          <p className="text-gray-600 text-sm">View and edit existing recipes</p>
        </button>

        <button
          onClick={() => navigate('/admin/categories')}
          className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FolderOpen className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Manage Categories</h3>
          <p className="text-gray-600 text-sm">Add and edit food categories</p>
        </button>
      </div>
    </div>
  );
}
