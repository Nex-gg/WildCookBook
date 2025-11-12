import { useState } from 'react';
import { User, MapPin, Award, Settings, LogOut, ChefHat, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  function goToAdmin() {
    window.history.pushState({}, '', '/admin');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div className="pb-24 pt-4 sm:pt-6 px-3 sm:px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                {profile.username[0].toUpperCase()}
              </div>
            )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 truncate">{profile.full_name}</h2>
            <p className="text-sm sm:text-base text-gray-600 truncate">@{profile.username}</p>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
              <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full text-xs sm:text-sm font-medium">
                {profile.subscription_tier === 'free' ? 'Free Plan' : profile.subscription_tier === 'sri_lankan' ? 'Sri Lankan Plan' : 'Global Plan'}
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-medium capitalize">
                <ChefHat className="w-3 h-3" />
                {profile.skill_level}
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 text-yellow-600">
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-semibold">{profile.points} points</span>
              </div>
            </div>
          </div>
        </div>

        {profile.bio && (
          <div className="mb-3 sm:mb-4">
            <p className="text-sm sm:text-base text-gray-700">{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-t border-b">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-500">0</div>
            <div className="text-[10px] sm:text-sm text-gray-600">Recipes Tried</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-500">0</div>
            <div className="text-[10px] sm:text-sm text-gray-600">Bookmarks</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-500">0</div>
            <div className="text-[10px] sm:text-sm text-gray-600">Requests</div>
          </div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {profile.is_admin && (
          <button
            onClick={goToAdmin}
            className="w-full bg-gradient-to-r from-red-400 to-pink-400 rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-lg transition-all active:scale-98"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-semibold text-sm sm:text-base text-white">Admin Panel</div>
              <div className="text-xs sm:text-sm text-white/90 truncate">Manage recipes and content</div>
            </div>
          </button>
        )}

        <button
          onClick={() => setShowEditModal(true)}
          className="w-full bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-lg transition-all active:scale-98"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-semibold text-sm sm:text-base">Edit Profile</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Update your personal information</div>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-lg transition-all active:scale-98">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-semibold text-sm sm:text-base">Settings</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Preferences and privacy</div>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-lg transition-all active:scale-98">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-semibold text-sm sm:text-base">My Badges</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">View your achievements</div>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-lg transition-all active:scale-98">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-semibold text-sm sm:text-base">Country</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">{profile.country || 'Not set'}</div>
          </div>
        </button>

        <button
          onClick={signOut}
          className="w-full bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-lg hover:bg-red-50 transition-all active:scale-98"
        >
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-semibold text-red-600 text-sm sm:text-base">Sign Out</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">Log out of your account</div>
          </div>
        </button>
      </div>
    </div>

    {showEditModal && (
      <EditProfileModal
        profile={profile}
        onClose={() => setShowEditModal(false)}
        onUpdate={() => {
          refreshProfile();
          setShowEditModal(false);
        }}
      />
    )}
    </>
  );
}
