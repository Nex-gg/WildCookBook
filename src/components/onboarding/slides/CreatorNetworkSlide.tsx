import { Users, Star, Sparkles } from 'lucide-react';

const creators = [
  { name: 'Chef Maria', specialty: 'Italian & Mediterranean', followers: '40K+' },
  { name: 'Chef Rajesh', specialty: 'Indian & Asian Fusion', followers: '35K+' },
  { name: 'Chef Sophie', specialty: 'French Pastries', followers: '28K+' },
  { name: 'Chef Carlos', specialty: 'Mexican Cuisine', followers: '32K+' },
];

export default function CreatorNetworkSlide() {
  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Users className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold mb-2">Growing Creator Network</h2>
        <p className="text-gray-600 mb-8">
          Access recipes from multiple professional chefs and food creators, all in one place
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {creators.map((creator, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-left">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-200 to-pink-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-red-600">
                    {creator.name.split(' ')[1][0]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">4.9</span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{creator.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{creator.specialty}</p>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Users className="w-4 h-4" />
                <span>{creator.followers} followers</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <h3 className="font-bold text-xl">Platform Exclusive</h3>
          </div>
          <p className="text-sm opacity-90">
            Get access to creator collaborations and special recipes you won't find anywhere else
          </p>
        </div>

        <p className="text-gray-500 mt-6 text-sm">
          New creators joining every month. More recipes, more variety, more inspiration.
        </p>
      </div>
    </div>
  );
}
