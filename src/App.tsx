import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SplashScreen from './components/common/SplashScreen';
import WelcomeScreen from './components/auth/WelcomeScreen';
import SignUpForm from './components/auth/SignUpForm';
import SignInForm from './components/auth/SignInForm';
import OnboardingSlider from './components/onboarding/OnboardingSlider';
import BottomNav from './components/navigation/BottomNav';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RequestsPage from './pages/RequestsPage';
import BookmarksPage from './pages/BookmarksPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateRecipe from './pages/admin/CreateRecipe';
import ManageRecipes from './pages/admin/ManageRecipes';
import ManageCategories from './pages/admin/ManageCategories';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (!user) {
        setShowWelcome(true);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    if (user && profile && isNewUser) {
      setShowOnboarding(true);
    }
  }, [user, profile, isNewUser]);

  useEffect(() => {
    function handlePopState() {
      setCurrentRoute(window.location.pathname);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    setIsNewUser(false);
  }

  function handleTabChange(tab: string) {
    if (tab !== currentTab) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTab(tab);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 150);
    }
  }

  if (showSplash || loading) {
    return <SplashScreen />;
  }

  if (!user || !profile) {
    if (showWelcome && !authMode) {
      return (
        <div className="animate-fade-in">
          <WelcomeScreen
            onGetStarted={() => {
              setShowWelcome(false);
              setTimeout(() => setAuthMode('signup'), 100);
            }}
            onSignIn={() => {
              setShowWelcome(false);
              setTimeout(() => setAuthMode('signin'), 100);
            }}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-slide-in-from-bottom">
          {authMode === 'signup' ? (
            <SignUpForm
              onSuccess={() => {
                setIsNewUser(true);
                setAuthMode('signin');
              }}
              onSwitchToSignIn={() => setAuthMode('signin')}
            />
          ) : (
            <SignInForm
              onSuccess={() => {}}
              onSwitchToSignUp={() => setAuthMode('signup')}
            />
          )}
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingSlider onComplete={handleOnboardingComplete} />;
  }

  if (currentRoute.startsWith('/admin')) {
    if (currentRoute === '/admin/recipes/new') {
      return <CreateRecipe />;
    }
    if (currentRoute === '/admin/recipes') {
      return <ManageRecipes />;
    }
    if (currentRoute === '/admin/categories') {
      return <ManageCategories />;
    }
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div
        className={`transition-all duration-200 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {currentTab === 'home' && <HomePage />}
        {currentTab === 'recipes' && <RecipesPage />}
        {currentTab === 'requests' && <RequestsPage />}
        {currentTab === 'bookmarks' && <BookmarksPage />}
        {currentTab === 'profile' && <ProfilePage />}
      </div>
      <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
