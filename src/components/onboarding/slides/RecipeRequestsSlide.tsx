import { MessageSquarePlus, Award, TrendingUp, CheckCircle } from 'lucide-react';

export default function RecipeRequestsSlide() {
  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MessageSquarePlus className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold mb-2">Request Any Recipe</h2>
        <p className="text-gray-600 mb-8">
          Can't find what you're looking for? Request it and our creators will make it for you
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquarePlus className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Submit Your Request</h3>
                <p className="text-gray-600 text-sm">
                  Tell us what recipe you'd like to see, including cuisine type and difficulty level
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Community Voting</h3>
                <p className="text-gray-600 text-sm">
                  Other users can upvote your request to increase its priority
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Progress</h3>
                <p className="text-gray-600 text-sm">
                  Get notified when your request is approved and the recipe is published
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Earn Badges</h3>
                <p className="text-gray-600 text-sm">
                  Collect achievement badges for your contributions and engagement
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
          <p className="text-sm text-gray-700">
            <strong>Pro Tip:</strong> The more detailed your request, the better the final recipe will be!
          </p>
        </div>
      </div>
    </div>
  );
}
