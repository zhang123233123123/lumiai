import type {
  AnalysisOverviewData,
  DashboardData,
  FoundationOverviewData,
  PracticeOverviewData,
  WeaknessOverviewData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const fetchJson = async <T,>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const getDashboardData = () => fetchJson<DashboardData>('/api/ui/dashboard');
export const getAnalysisData = () => fetchJson<AnalysisOverviewData>('/api/ui/analysis');
export const getFoundationData = () => fetchJson<FoundationOverviewData>('/api/ui/foundation');
export const getWeaknessData = () => fetchJson<WeaknessOverviewData>('/api/ui/weakness');
export const getPracticeData = () => fetchJson<PracticeOverviewData>('/api/ui/practice');
