import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types/database';
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Upload, X } from 'lucide-react';

export default function ManageCategories() {
  const { profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('');
    setImageUrl('');
    setShowModal(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setIcon(category.icon || '');
    setImageUrl(category.image_url || '');
    setShowModal(true);
  }

  async function handleImageUpload(file: File) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID 4e35a6dd3c4d38b',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.link);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name,
            slug,
            description: description || null,
            icon: icon || null,
            image_url: imageUrl || null,
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        const maxSortOrder = Math.max(...categories.map((c) => c.sort_order), 0);

        const { error } = await supabase.from('categories').insert({
          name,
          slug,
          description: description || null,
          icon: icon || null,
          image_url: imageUrl || null,
          sort_order: maxSortOrder + 1,
          is_active: true,
        });

        if (error) throw error;
      }

      setShowModal(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  }

  async function deleteCategory(categoryId: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);

      if (error) throw error;
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  }

  async function toggleActive(categoryId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', categoryId);

      if (error) throw error;
      loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  }

  function goBack() {
    window.history.back();
  }

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

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Categories</h1>
          <p className="text-gray-600">Add, edit, and organize food categories</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-medium hover:from-red-500 hover:to-pink-500 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-video relative">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-100 via-pink-100 to-orange-100 flex items-center justify-center">
                    <span className="text-6xl">{category.icon || '🍽️'}</span>
                  </div>
                )}
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {category.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{category.icon || '🍽️'}</span>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {category.description || 'No description'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(category.id, category.is_active)}
                    className={`px-4 py-2 rounded-xl transition-colors text-sm font-medium ${
                      category.is_active
                        ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    {category.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="e.g., Burgers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="e.g., 🍔"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="flex gap-4">
                  {imageUrl && (
                    <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex-1 px-4 py-3 border-2 border-dashed rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="w-5 h-5" /> Upload Image</>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-medium hover:from-red-500 hover:to-pink-500 transition-all disabled:opacity-50"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
