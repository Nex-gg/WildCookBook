import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import YouTubeSlide from './slides/YouTubeSlide';
import CulturalMosaicSlide from './slides/CulturalMosaicSlide';
import NutritionCategoriesSlide from './slides/NutritionCategoriesSlide';
import RecipeRequestsSlide from './slides/RecipeRequestsSlide';
import CreatorNetworkSlide from './slides/CreatorNetworkSlide';

interface OnboardingSliderProps {
  onComplete: () => void;
}

export default function OnboardingSlider({ onComplete }: OnboardingSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preferences, setPreferences] = useState({
    cuisines: [] as string[],
    nutritionCategories: [] as string[],
  });

  const totalSlides = 5;

  function handleNext() {
    if (currentSlide < totalSlides - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete();
    }
  }

  function handleBack() {
    if (currentSlide > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setIsTransitioning(false);
      }, 300);
    }
  }

  function handleSkip() {
    onComplete();
  }

  const slides = [
    <YouTubeSlide key="youtube" />,
    <CulturalMosaicSlide
      key="cultural"
      selectedCuisines={preferences.cuisines}
      onSelectCuisine={(cuisine) => {
        setPreferences({
          ...preferences,
          cuisines: preferences.cuisines.includes(cuisine)
            ? preferences.cuisines.filter((c) => c !== cuisine)
            : [...preferences.cuisines, cuisine],
        });
      }}
    />,
    <NutritionCategoriesSlide
      key="nutrition"
      selectedCategories={preferences.nutritionCategories}
      onSelectCategory={(category) => {
        setPreferences({
          ...preferences,
          nutritionCategories: preferences.nutritionCategories.includes(category)
            ? preferences.nutritionCategories.filter((c) => c !== category)
            : [...preferences.nutritionCategories, category],
        });
      }}
    />,
    <RecipeRequestsSlide key="requests" />,
    <CreatorNetworkSlide key="creators" />,
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-gradient-to-r from-red-400 to-pink-400'
                    : 'w-1 bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip
          </button>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          <div
            className={`h-full transition-all duration-500 ease-out flex ${
              isTransitioning ? 'opacity-90' : 'opacity-100'
            }`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`w-full flex-shrink-0 h-full overflow-y-auto transition-all duration-500 ${
                  index === currentSlide ? 'scale-100 opacity-100' : 'scale-95 opacity-50'
                }`}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 flex gap-4 flex-shrink-0">
          {currentSlide > 0 && (
            <button
              onClick={handleBack}
              disabled={isTransitioning}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="flex-1 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-medium hover:from-red-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-95"
          >
            {currentSlide === totalSlides - 1 ? 'Get Started' : 'Next'}
            {currentSlide < totalSlides - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
