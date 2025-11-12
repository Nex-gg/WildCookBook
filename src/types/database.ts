export type SubscriptionTier = 'free' | 'sri_lankan' | 'global';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'paused';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type RecipeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type RequestStatus = 'submitted' | 'under_review' | 'approved' | 'in_production' | 'published' | 'rejected';
export type UpdateType = 'recipe' | 'feature' | 'announcement' | 'creator';
export type BadgeType = 'request' | 'engagement' | 'achievement';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  country?: string;
  country_code?: string;
  subscription_tier: SubscriptionTier;
  dietary_preferences: string[];
  skill_level: SkillLevel;
  favorite_cuisines: string[];
  points: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'sri_lankan' | 'global';
  status: SubscriptionStatus;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description?: string;
  video_url?: string;
  thumbnail_url?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: RecipeDifficulty;
  nutrition_info: NutritionInfo;
  category_id?: string;
  tags: string[];
  cuisine_type?: string;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  average_rating: number;
  rating_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface Instruction {
  step: number;
  description: string;
  image_url?: string;
  timer?: number;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface Bookmark {
  id: string;
  user_id: string;
  recipe_id: string;
  folder: string;
  notes?: string;
  created_at: string;
}

export interface RecipeRequest {
  id: string;
  user_id: string;
  recipe_name: string;
  cuisine_type?: string;
  difficulty_preference?: number;
  dietary_restrictions: string[];
  occasion?: string;
  additional_notes?: string;
  status: RequestStatus;
  upvotes: number;
  admin_notes?: string;
  completed_recipe_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeRating {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: BadgeType;
  badge_name: string;
  earned_at: string;
}

export interface AppUpdate {
  id: string;
  title: string;
  content: string;
  type: UpdateType;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface EmailVerification {
  id: string;
  user_id: string;
  email: string;
  otp: string;
  expires_at: string;
  verified: boolean;
  attempts: number;
  created_at: string;
}
