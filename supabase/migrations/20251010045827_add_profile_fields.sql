/*
  # Add profile customization fields

  1. Changes
    - Add `avatar_url` column to store profile picture URL (from Imgur or other CDN)
    - Add `bio` column to store user biography text
    - Add `skill_level` column to store cooking skill level (beginner, intermediate, advanced)
  
  2. Notes
    - All fields are optional (nullable) to allow gradual profile completion
    - Existing profiles will have NULL values until users update their profiles
    - avatar_url stores the external CDN URL, not local file paths
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'skill_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN skill_level text DEFAULT 'beginner';
  END IF;
END $$;
