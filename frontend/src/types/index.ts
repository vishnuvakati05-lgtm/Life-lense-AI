export interface AllergenMatch {
  allergen_id: string;
  allergen_name: string;
  status: 'POTENTIAL_ALLERGEN_DETECTED' | 'PRECAUTIONARY_WARNING' | 'NO_LISTED_MATCH_FOUND' | 'UNABLE_TO_VERIFY';
  evidence: Evidence[];
  reason: string;
}

export interface Evidence {
  type: string;
  matched_term?: string;
  found_in?: string;
  match_type?: string;
  precautionary_phrase?: string;
  context?: string;
}

export interface TextQuality {
  quality: 'good' | 'fair' | 'poor' | 'missing';
  concerns: string[];
  is_usable: boolean;
  text_length?: number;
}

export interface AllergenAnalysis {
  matches: AllergenMatch[];
  text_quality: TextQuality;
  limitations: string[];
  unable_to_verify: boolean;
  ingredients_parsed: string[];
  total_ingredients_found: number;
}

export interface NutrientInfo {
  value?: number;
  unit?: string;
  status: 'known' | 'unknown';
  raw_value?: string;
  percent_daily_value?: number;
  level?: 'high' | 'moderate' | 'low';
  less_than?: boolean;
  equivalent_salt_g?: number;
  converted_from?: string;
  note?: string;
}

export interface NutritionAnalysis {
  nutrients: Record<string, NutrientInfo>;
  serving_info: { value: number; unit: string; raw: string } | null;
  explanations: string[];
  limitations: string[];
  caffeine_info: { amount_mg: number; per_serving: boolean; note: string } | null;
}

export interface IngredientSource {
  title: string;
  publisher?: string;
  year?: string;
  url?: string;
}

export interface IngredientItem {
  raw_name: string;
  normalized_name: string;
  is_additive: boolean;
  ins_number: string | null;
  e_number: string | null;
  category: string;
  technical_function: string;
  why_added: string;
  safety_assessment: string;
  evidence_concerns: string;
  what_we_do_not_know: string;
  short_summary: string;
  sources: IngredientSource[];
  confidence: number;
}

export interface IngredientIntelligence {
  total_ingredients: number;
  parsed_ingredients: IngredientItem[];
  additives_count: number;
  additives: IngredientItem[];
  categories_present: string[];
  summary: string;
  completeness_note: string;
}

export interface ScanResult {
  scan_id: string;
  image_path?: string;
  quality?: Record<string, any>;
  extracted_text: string;
  ingredients: string;
  allergen_statement: string;
  nutrition_text: string;
  confidence: number | null;
  warnings: string[];
}

export interface AnalysisResult {
  scan_id: string;
  product_name: string;
  overall_status: 'POTENTIAL_ALLERGEN_DETECTED' | 'PRECAUTIONARY_WARNING' | 'NO_LISTED_MATCH_FOUND' | 'UNABLE_TO_VERIFY';
  allergen_analysis: AllergenAnalysis;
  nutrition_analysis: NutritionAnalysis;
  ingredient_intelligence?: IngredientIntelligence;
  extracted_ingredients: string;
  extracted_allergen_statement: string;
  short_summary?: string;
  limitations: string[];
  disclaimer: string;
}

export interface ChemicalExplainerResult {
  found: boolean;
  query: string;
  name?: string;
  ins_number?: string;
  e_number?: string;
  category?: string;
  short_answer?: string;
  what_it_is?: string;
  why_it_is_added?: string;
  what_the_evidence_says?: string;
  potential_concerns?: string;
  what_we_do_not_know?: string;
  sources?: IngredientSource[];
  distinctions?: {
    established_facts: string;
    evidence_concerns: string;
    unsupported_claims: string;
  };
  message?: string;
  guidance?: string;
  limitations?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: IngredientSource[];
  suggested_followups?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  allergens: string[];
  custom_allergens: string[];
  language: 'en' | 'hi' | 'te';
  font_size: 'small' | 'medium' | 'large' | 'xlarge';
  speech_rate: number;
}

export interface ScanRecord {
  id: string;
  profile_id?: string;
  product_name: string;
  barcode?: string;
  extracted_ingredients: string;
  extracted_nutrition: Record<string, any>;
  allergen_results?: AllergenAnalysis;
  nutrition_analysis?: NutritionAnalysis;
  ingredient_intelligence?: IngredientIntelligence;
  data_source: string;
  created_at: string;
}

export interface BarcodeResult {
  found: boolean;
  barcode: string;
  product_name?: string;
  brand?: string;
  ingredients_text?: string;
  allergens?: string;
  nutrition?: Record<string, any>;
  image_url?: string;
  source?: string;
  retrieved_at?: string;
  note?: string;
  message?: string;
}

export interface ComparisonResult {
  product_a: {
    name: string;
    allergen_analysis: AllergenAnalysis;
    nutrition: Record<string, any>;
  };
  product_b: {
    name: string;
    allergen_analysis: AllergenAnalysis;
    nutrition: Record<string, any>;
  };
  nutrition_comparison: {
    comparisons: Array<{
      nutrient: string;
      label: string;
      product_a_value: number;
      product_b_value: number;
      unit: string;
      difference: number;
      note: string;
    }>;
    incomparable: Array<{
      nutrient: string;
      label: string;
      reason: string;
    }>;
    note: string;
  };
  disclaimer: string;
}
