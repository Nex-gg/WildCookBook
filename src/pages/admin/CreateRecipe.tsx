import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ChefHat, Plus, X, Loader2, Upload, ArrowLeft } from 'lucide-react';
import { Ingredient, Instruction, RecipeDifficulty } from '../../types/database';

export default function CreateRecipe() {
  const { profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('easy');
  const [categoryId, setCategoryId] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' }
  ]);

  const [instructions, setInstructions] = useState<Instruction[]>([
    { step: 1, description: '' }
  ]);

  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

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
        setThumbnailUrl(data.data.link);
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

  function addIngredient() {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  }

  function addInstruction() {
    setInstructions([...instructions, { step: instructions.length + 1, description: '' }]);
  }

  function removeInstruction(index: number) {
    const updated = instructions.filter((_, i) => i !== index);
    updated.forEach((inst, i) => inst.step = i + 1);
    setInstructions(updated);
  }

  function updateInstruction(index: number, description: string) {
    const updated = [...instructions];
    updated[index] = { ...updated[index], description };
    setInstructions(updated);
  }

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag));
  }

  async function handleSubmit(publish: boolean) {
    if (!title.trim() || ingredients.length === 0 || instructions.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const { error } = await supabase.from('recipes').insert({
        title,
        slug,
        description: description || null,
        video_url: videoUrl || null,
        thumbnail_url: thumbnailUrl || null,
        ingredients,
        instructions,
        prep_time: prepTime,
        cook_time: cookTime,
        servings,
        difficulty,
        nutrition_info: { calories, protein, carbs, fat },
        category_id: categoryId || null,
        tags,
        cuisine_type: cuisineType || null,
        is_featured: false,
        is_published: publish,
        view_count: 0,
        average_rating: 0,
        rating_count: 0,
        created_by: profile.id,
        published_at: publish ? new Date().toISOString() : null,
      });

      if (error) throw error;

      alert(publish ? 'Recipe published successfully!' : 'Recipe saved as draft!');
      window.history.back();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-4xl mx-auto">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Recipe</h1>
        <p className="text-gray-600">Fill in the details to create a new recipe</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="e.g., Classic Burger"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                placeholder="Brief description of the recipe..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
              <div className="flex gap-4">
                {thumbnailUrl && (
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-32 h-32 object-cover rounded-xl" />
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min)</label>
                <input
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (min)</label>
                <input
                  type="number"
                  value={cookTime}
                  onChange={(e) => setCookTime(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
              <input
                type="text"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="e.g., American, Italian, Asian"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Add a tag..."
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Ingredients *</h2>
            <button
              onClick={addIngredient}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  className="flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Ingredient name"
                />
                <input
                  type="text"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  className="w-24 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Amount"
                />
                <input
                  type="text"
                  value={ingredient.unit || ''}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="w-24 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Unit"
                />
                <button
                  onClick={() => removeIngredient(index)}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Instructions *</h2>
            <button
              onClick={addInstruction}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-700 font-bold text-sm">
                  {index + 1}
                </div>
                <textarea
                  value={instruction.description}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  rows={2}
                  className="flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                  placeholder="Describe this step..."
                />
                <button
                  onClick={() => removeInstruction(index)}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Nutrition Information</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex-1 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-medium hover:from-red-500 hover:to-pink-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
            ) : (
              'Publish Recipe'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
