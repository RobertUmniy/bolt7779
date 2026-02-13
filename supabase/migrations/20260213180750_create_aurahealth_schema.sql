/*
  # AuraHealth AI Database Schema

  ## Overview
  This migration creates the foundational schema for AuraHealth AI platform,
  enabling correlation analysis between user health reports and environmental stressors.

  ## New Tables
  
  ### `health_reports`
  Stores user-reported symptoms and well-being data
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to authenticated user
  - `symptoms_text` (text) - Raw user input describing their condition
  - `parsed_symptoms` (jsonb) - NLP-processed symptom categories
  - `location_lat` (numeric) - Latitude of report location
  - `location_lng` (numeric) - Longitude of report location
  - `reported_at` (timestamptz) - When the report was submitted
  - `created_at` (timestamptz) - Record creation timestamp

  ### `environmental_data`
  Stores environmental stressor measurements by location and time
  - `id` (uuid, primary key) - Unique identifier
  - `location_lat` (numeric) - Latitude
  - `location_lng` (numeric) - Longitude
  - `pm25_level` (numeric) - Air quality PM2.5 measurement
  - `no2_level` (numeric) - Nitrogen dioxide level
  - `noise_db` (numeric) - Noise level in decibels
  - `heat_index` (numeric) - Urban heat island index
  - `light_pollution` (numeric) - Light pollution index
  - `green_space_distance` (numeric) - Distance to nearest green space (meters)
  - `measured_at` (timestamptz) - Measurement timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### `risk_assessments`
  Stores calculated risk scores and correlations
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to authenticated user
  - `health_report_id` (uuid) - Reference to health report
  - `chronic_stress_risk` (numeric) - Risk score for chronic stress (0-100)
  - `respiratory_risk` (numeric) - Risk score for respiratory issues (0-100)
  - `sleep_disorder_risk` (numeric) - Risk score for sleep disorders (0-100)
  - `environmental_stress_index` (numeric) - Overall ESI score
  - `recommendations` (jsonb) - AI-generated recommendations
  - `calculated_at` (timestamptz) - When risk was calculated
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own health reports and risk assessments
  - Environmental data is publicly readable (anonymized sensor data)
*/

-- Create health_reports table
CREATE TABLE IF NOT EXISTS health_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  symptoms_text text NOT NULL,
  parsed_symptoms jsonb DEFAULT '{}'::jsonb,
  location_lat numeric NOT NULL,
  location_lng numeric NOT NULL,
  reported_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create environmental_data table
CREATE TABLE IF NOT EXISTS environmental_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_lat numeric NOT NULL,
  location_lng numeric NOT NULL,
  pm25_level numeric DEFAULT 0,
  no2_level numeric DEFAULT 0,
  noise_db numeric DEFAULT 0,
  heat_index numeric DEFAULT 0,
  light_pollution numeric DEFAULT 0,
  green_space_distance numeric DEFAULT 0,
  measured_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create risk_assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  health_report_id uuid REFERENCES health_reports(id) ON DELETE CASCADE,
  chronic_stress_risk numeric DEFAULT 0,
  respiratory_risk numeric DEFAULT 0,
  sleep_disorder_risk numeric DEFAULT 0,
  environmental_stress_index numeric DEFAULT 0,
  recommendations jsonb DEFAULT '[]'::jsonb,
  calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_reports
CREATE POLICY "Users can view own health reports"
  ON health_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health reports"
  ON health_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health reports"
  ON health_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health reports"
  ON health_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for environmental_data (public read)
CREATE POLICY "Anyone can view environmental data"
  ON environmental_data FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert environmental data"
  ON environmental_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for risk_assessments
CREATE POLICY "Users can view own risk assessments"
  ON risk_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk assessments"
  ON risk_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own risk assessments"
  ON risk_assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own risk assessments"
  ON risk_assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_health_reports_user_id ON health_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_health_reports_reported_at ON health_reports(reported_at);
CREATE INDEX IF NOT EXISTS idx_environmental_data_location ON environmental_data(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_user_id ON risk_assessments(user_id);
