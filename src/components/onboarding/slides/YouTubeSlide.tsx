import { Youtube, Users } from 'lucide-react';

export default function YouTubeSlide() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <Youtube className="w-12 h-12 text-white" />
      </div>

      <h2 className="text-3xl font-bold mb-4">Welcome to FlavorFusion</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Join thousands of food enthusiasts exploring exclusive recipes from top culinary creators
      </p>

      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        <div className="aspect-video bg-gradient-to-br from-red-100 to-pink-100 rounded-xl mb-4 flex items-center justify-center">
          <Youtube className="w-16 h-16 text-red-400" />
        </div>

        <h3 className="font-bold text-xl mb-2">Chef Maria's Kitchen</h3>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Users className="w-5 h-5" />
          <span>40,000+ subscribers</span>
        </div>
      </div>

      <p className="text-gray-500 mt-6 max-w-md">
        Get access to premium video recipes, step-by-step instructions, and personalized cooking tips
      </p>
    </div>
  );
}
