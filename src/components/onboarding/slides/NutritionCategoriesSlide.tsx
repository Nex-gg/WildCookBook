import { Check, Dumbbell, Baby, Heart, TrendingDown, Activity, Apple } from 'lucide-react';

interface NutritionCategoriesSlideProps {
  selectedCategories: string[];
  onSelectCategory: (category: string) => void;
}

const categories = [
  { name: 'Gym & Fitness', icon: Dumbbell, color: 'from-orange-400 to-red-400' },
  { name: 'Pregnancy Nutrition', icon: Baby, color: 'from-pink-400 to-red-400' },
  { name: 'Kids Meals', icon: Apple, color: 'from-yellow-400 to-orange-400' },
  { name: 'Weight Loss', icon: TrendingDown, color: 'from-green-400 to-teal-400' },
  { name: 'Diabetic-Friendly', icon: Activity, color: 'from-blue-400 to-cyan-400' },
  { name: 'Heart-Healthy', icon: Heart, color: 'from-red-400 to-pink-400' },
];

export default function NutritionCategoriesSlide({
  selectedCategories,
  onSelectCategory,
}: NutritionCategoriesSlideProps) {
  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-2">Nutrition Categories</h2>
        <p className="text-gray-600 text-center mb-8">
          Choose categories that match your dietary goals and lifestyle
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => onSelectCategory(category.name)}
                className={`relative p-6 rounded-2xl transition-all transform hover:scale-105 ${
                  selectedCategories.includes(category.name)
                    ? 'ring-4 ring-red-400 shadow-xl'
                    : 'hover:shadow-lg bg-white'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 rounded-2xl`}
                />
                <div className="relative flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-lg">{category.name}</div>
                  </div>
                  {selectedCategories.includes(category.name) && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-gray-500 mt-6">
          {selectedCategories.length > 0
            ? `${selectedCategories.length} categories selected`
            : 'Select categories to personalize your experience'}
        </p>
      </div>
    </div>
  );
}
