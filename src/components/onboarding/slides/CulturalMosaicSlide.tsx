import { Check } from 'lucide-react';

interface CulturalMosaicSlideProps {
  selectedCuisines: string[];
  onSelectCuisine: (cuisine: string) => void;
}

const cuisines = [
  { name: 'Italian', emoji: '🍝', color: 'from-green-400 to-red-400' },
  { name: 'Japanese', emoji: '🍣', color: 'from-pink-400 to-red-400' },
  { name: 'Mexican', emoji: '🌮', color: 'from-yellow-400 to-red-400' },
  { name: 'Indian', emoji: '🍛', color: 'from-orange-400 to-yellow-400' },
  { name: 'Chinese', emoji: '🥢', color: 'from-red-400 to-yellow-400' },
  { name: 'Thai', emoji: '🍜', color: 'from-green-400 to-yellow-400' },
  { name: 'French', emoji: '🥐', color: 'from-blue-400 to-pink-400' },
  { name: 'Mediterranean', emoji: '🫒', color: 'from-teal-400 to-blue-400' },
  { name: 'Korean', emoji: '🥘', color: 'from-red-400 to-orange-400' },
  { name: 'Middle Eastern', emoji: '🧆', color: 'from-amber-400 to-orange-400' },
  { name: 'American', emoji: '🍔', color: 'from-red-400 to-blue-400' },
  { name: 'Vietnamese', emoji: '🍲', color: 'from-green-400 to-red-400' },
];

export default function CulturalMosaicSlide({
  selectedCuisines,
  onSelectCuisine,
}: CulturalMosaicSlideProps) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Explore World Cuisines</h2>
        <p className="text-gray-600 text-center mb-8">
          Select your favorite cuisines to personalize your recipe feed
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine.name}
              onClick={() => onSelectCuisine(cuisine.name)}
              className={`relative p-6 rounded-2xl transition-all transform hover:scale-105 ${
                selectedCuisines.includes(cuisine.name)
                  ? 'ring-4 ring-red-400 shadow-xl'
                  : 'hover:shadow-lg'
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cuisine.color} opacity-20 rounded-2xl`}
              />
              <div className="relative text-center">
                <div className="text-5xl mb-2">{cuisine.emoji}</div>
                <div className="font-semibold">{cuisine.name}</div>
              </div>
              {selectedCuisines.includes(cuisine.name) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-6">
          {selectedCuisines.length > 0
            ? `${selectedCuisines.length} cuisines selected`
            : 'Tap to select your preferences'}
        </p>
      </div>
    </div>
  );
}
