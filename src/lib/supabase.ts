import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface HealthReport {
  id: string;
  user_id: string;
  symptoms_text: string;
  parsed_symptoms: Record<string, unknown>;
  location_lat: number;
  location_lng: number;
  reported_at: string;
  created_at: string;
}

export interface EnvironmentalData {
  id: string;
  location_lat: number;
  location_lng: number;
  pm25_level: number;
  no2_level: number;
  noise_db: number;
  heat_index: number;
  light_pollution: number;
  green_space_distance: number;
  measured_at: string;
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  user_id: string;
  health_report_id: string;
  chronic_stress_risk: number;
  respiratory_risk: number;
  sleep_disorder_risk: number;
  environmental_stress_index: number;
  recommendations: Array<{
    type: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  calculated_at: string;
  created_at: string;
}
