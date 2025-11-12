/*
  # Add country column to profiles

  1. Changes
    - Add `country` column to `profiles` table to store user's country
    - Column is optional (nullable) and stores the detected country name
  
  2. Notes
    - Existing profiles will have NULL for country until they update their profile
    - New signups will have this automatically populated via geolocation
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'country'
  ) THEN
    ALTER TABLE profiles ADD COLUMN country text;
  END IF;
END $$;
