import {
  ScanResult,
  AnalysisResult,
  ChemicalExplainerResult,
  BarcodeResult,
  ScanRecord
} from '../types';

const API_BASE = '/api';

export async function scanLabelImage(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to scan image. Please try a clearer picture.');
  }

  return response.json();
}

export async function analyzeLabelData(payload: {
  product_name: string;
  ingredients: string;
  allergen_statement?: string;
  nutrition?: Record<string, any>;
  user_allergens?: string[];
  language?: string;
}): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Analysis failed');
  }

  return response.json();
}

export async function explainChemical(
  query: string,
  language: string = 'en'
): Promise<ChemicalExplainerResult> {
  const response = await fetch(`${API_BASE}/ingredient/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, language }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to fetch ingredient explanation');
  }

  return response.json();
}

export async function sendChatMessage(
  message: string,
  productContext: Record<string, any>,
  history: Array<{ role: string; content: string }> = [],
  language: string = 'en',
  responseLength: 'quick' | 'detailed' = 'quick'
): Promise<{
  answer: string;
  language: string;
  sources: Array<{ title: string; publisher?: string; year?: string; url?: string }>;
  suggested_followups: string[];
}> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      product_context: productContext,
      history,
      language,
      response_length: responseLength,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to send chat message');
  }

  return response.json();
}

export async function lookupBarcodeOFF(barcode: string): Promise<BarcodeResult> {
  const response = await fetch(`${API_BASE}/barcode/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ barcode }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Product not found in barcode database');
  }

  return response.json();
}

export async function fetchScanHistory(): Promise<ScanRecord[]> {
  try {
    const response = await fetch(`${API_BASE}/history`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.scans || [];
  } catch {
    return [];
  }
}

export async function clearScanHistory(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/history`, { method: 'DELETE' });
    return response.ok;
  } catch {
    return false;
  }
}

