/*
  # Initial Recipe Subscription Platform Schema

  ## Overview
  Creates the foundational database structure for a premium recipe subscription platform with geo-targeted pricing, influencer content, and personalized features.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, FK to auth.users) - User identifier
  - `username` (text, unique) - Unique username
  - `full_name` (text) - User's full name
  - `avatar_url` (text) - Profile picture URL
  - `bio` (text) - User bio/description
  - `country_code` (text) - ISO country code for geo-targeting
  - `subscription_tier` (text) - 'free', 'sri_lankan', or 'global'
  - `dietary_preferences` (jsonb) - Array of dietary preferences
  - `skill_level` (text) - 'beginner', 'intermediate', 'advanced', 'expert'
  - `favorite_cuisines` (jsonb) - Array of favorite cuisine types
  - `points` (int) - Gamification points
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `subscriptions`
  Subscription management and billing history
  - `id` (uuid, PK) - Subscription identifier
  - `user_id` (uuid, FK to profiles) - Subscriber
  - `tier` (text) - 'sri_lankan' or 'global'
  - `status` (text) - 'active', 'cancelled', 'past_due', 'paused'
  - `stripe_subscription_id` (text) - Stripe subscription reference
  - `stripe_customer_id` (text) - Stripe customer reference
  - `current_period_start` (timestamptz) - Billing period start
  - `current_period_end` (timestamptz) - Billing period end
  - `cancel_at_period_end` (boolean) - Cancellation flag
  - `created_at` (timestamptz) - Subscription start
  - `updated_at` (timestamptz) - Last modification

  ### 3. `categories`
  Recipe categories and cuisine types
  - `id` (uuid, PK) - Category identifier
  - `name` (text, unique) - Category name
  - `slug` (text, unique) - URL-friendly slug
  - `description` (text) - Category description
  - `image_url` (text) - Category banner image
  - `icon` (text) - Icon identifier for UI
  - `sort_order` (int) - Display order
  - `is_active` (boolean) - Visibility flag
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. `recipes`
  Recipe content with multimedia and metadata
  - `id` (uuid, PK) - Recipe identifier
  - `title` (text) - Recipe title
  - `slug` (text, unique) - URL-friendly slug
  - `description` (text) - Short description
  - `video_url` (text) - Primary video URL
  - `thumbnail_url` (text) - Recipe thumbnail
  - `ingredients` (jsonb) - Structured ingredient list
  - `instructions` (jsonb) - Step-by-step instructions
  - `prep_time` (int) - Prep time in minutes
  - `cook_time` (int) - Cook time in minutes
  - `servings` (int) - Number of servings
  - `difficulty` (text) - 'easy', 'medium', 'hard', 'expert'
  - `nutrition_info` (jsonb) - Nutritional breakdown
  - `category_id` (uuid, FK to categories) - Primary category
  - `tags` (jsonb) - Array of tags
  - `cuisine_type` (text) - Cuisine classification
  - `is_featured` (boolean) - Featured status
  - `is_published` (boolean) - Publication status
  - `view_count` (int) - View counter
  - `average_rating` (decimal) - Average user rating
  - `rating_count` (int) - Number of ratings
  - `created_by` (uuid) - Creator/admin user
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `published_at` (timestamptz) - Publication timestamp

  ### 5. `bookmarks`
  User-saved recipes with organization
  - `id` (uuid, PK) - Bookmark identifier
  - `user_id` (uuid, FK to profiles) - User who bookmarked
  - `recipe_id` (uuid, FK to recipes) - Bookmarked recipe
  - `folder` (text) - Organization folder name
  - `notes` (text) - Personal notes
  - `created_at` (timestamptz) - Bookmark timestamp

  ### 6. `recipe_requests`
  User recipe requests with tracking
  - `id` (uuid, PK) - Request identifier
  - `user_id` (uuid, FK to profiles) - Requesting user
  - `recipe_name` (text) - Requested recipe name
  - `cuisine_type` (text) - Requested cuisine
  - `difficulty_preference` (int) - 1-5 difficulty scale
  - `dietary_restrictions` (jsonb) - Array of dietary needs
  - `occasion` (text) - Special occasion/purpose
  - `additional_notes` (text) - Extra details
  - `status` (text) - 'submitted', 'under_review', 'approved', 'in_production', 'published', 'rejected'
  - `upvotes` (int) - Community upvote count
  - `admin_notes` (text) - Internal notes
  - `completed_recipe_id` (uuid, FK to recipes) - Link to created recipe
  - `created_at` (timestamptz) - Request timestamp
  - `updated_at` (timestamptz) - Last status update

  ### 7. `recipe_ratings`
  User ratings and reviews
  - `id` (uuid, PK) - Rating identifier
  - `user_id` (uuid, FK to profiles) - Reviewer
  - `recipe_id` (uuid, FK to recipes) - Rated recipe
  - `rating` (int) - 1-5 star rating
  - `review` (text) - Written review
  - `created_at` (timestamptz) - Review timestamp
  - `updated_at` (timestamptz) - Last edit

  ### 8. `user_badges`
  Gamification badges and achievements
  - `id` (uuid, PK) - Badge record identifier
  - `user_id` (uuid, FK to profiles) - Badge owner
  - `badge_type` (text) - Badge category
  - `badge_name` (text) - Badge identifier
  - `earned_at` (timestamptz) - Achievement timestamp

  ### 9. `app_updates`
  System announcements and updates
  - `id` (uuid, PK) - Update identifier
  - `title` (text) - Update title
  - `content` (text) - Update content
  - `type` (text) - 'recipe', 'feature', 'announcement', 'creator'
  - `image_url` (text) - Optional image
  - `link_url` (text) - Optional link
  - `is_active` (boolean) - Visibility flag
  - `created_at` (timestamptz) - Publication timestamp

  ### 10. `email_verifications`
  Email verification OTP management
  - `id` (uuid, PK) - Verification identifier
  - `user_id` (uuid, FK to auth.users) - User to verify
  - `email` (text) - Email being verified
  - `otp` (text) - 6-digit verification code
  - `expires_at` (timestamptz) - OTP expiry (10 minutes)
  - `verified` (boolean) - Verification status
  - `attempts` (int) - Failed attempt counter
  - `created_at` (timestamptz) - Creation timestamp

  ## Security (Row Level Security)

  All tables have RLS enabled with restrictive policies:
  - Users can only access their own data
  - Recipes and categories are publicly readable for authenticated users
  - Modifications require ownership verification
  - Admin operations require special permissions

  ## Indexes

  Optimized indexes for:
  - Username and email lookups
  - Recipe search and filtering
  - Bookmark queries
  - Subscription status checks
  - Request tracking

  ## Important Notes

  1. **Data Safety**: All operations use IF NOT EXISTS to prevent conflicts
  2. **RLS First**: Every table is locked down by default, policies grant minimal access
  3. **Cascading**: Foreign keys cascade appropriately to maintain referential integrity
  4. **Timestamps**: Automatic timestamp management with defaults
  5. **Performance**: Indexes on frequently queried columns
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  country_code text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'sri_lankan', 'global')),
  dietary_preferences jsonb DEFAULT '[]'::jsonb,
  skill_level text DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  favorite_cuisines jsonb DEFAULT '[]'::jsonb,
  points int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier text NOT NULL CHECK (tier IN ('sri_lankan', 'global')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'paused')),
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  icon text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  video_url text,
  thumbnail_url text,
  ingredients jsonb DEFAULT '[]'::jsonb,
  instructions jsonb DEFAULT '[]'::jsonb,
  prep_time int DEFAULT 0,
  cook_time int DEFAULT 0,
  servings int DEFAULT 1,
  difficulty text DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  nutrition_info jsonb DEFAULT '{}'::jsonb,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  cuisine_type text,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  view_count int DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.00,
  rating_count int DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  folder text DEFAULT 'My Recipes',
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS recipe_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_name text NOT NULL,
  cuisine_type text,
  difficulty_preference int CHECK (difficulty_preference BETWEEN 1 AND 5),
  dietary_restrictions jsonb DEFAULT '[]'::jsonb,
  occasion text,
  additional_notes text,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'in_production', 'published', 'rejected')),
  upvotes int DEFAULT 0,
  admin_notes text,
  completed_recipe_id uuid REFERENCES recipes(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recipe_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type text NOT NULL CHECK (badge_type IN ('request', 'engagement', 'achievement')),
  badge_name text NOT NULL,
  earned_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text DEFAULT 'announcement' CHECK (type IN ('recipe', 'feature', 'announcement', 'creator')),
  image_url text,
  link_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  otp text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  attempts int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_country_code ON profiles(country_code);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_category_id ON recipes(category_id);
CREATE INDEX IF NOT EXISTS idx_recipes_published ON recipes(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_recipes_featured ON recipes(is_featured);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_recipe_id ON bookmarks(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_requests_user_id ON recipe_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_requests_status ON recipe_requests(status);
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe_id ON recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Categories are viewable by authenticated users"
  ON categories FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Published recipes are viewable by authenticated users"
  ON recipes FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own recipe requests"
  ON recipe_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own recipe requests"
  ON recipe_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view all requests for upvoting"
  ON recipe_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view recipe ratings"
  ON recipe_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own ratings"
  ON recipe_ratings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own ratings"
  ON recipe_ratings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own ratings"
  ON recipe_ratings FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Active updates are viewable by authenticated users"
  ON app_updates FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view own email verifications"
  ON email_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own email verifications"
  ON email_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own email verifications"
  ON email_verifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());