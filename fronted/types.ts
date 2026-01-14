
export interface Recommendation {
  id: string;
  title: string;
  category: 'Writing' | 'Speaking' | 'Listening' | 'Reading';
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reason?: string;
}

export interface ErrorMetric {
  name: string;
  value: number;
  color: string;
}

export interface ErrorMetricsData {
  pending_count: number;
  metrics: ErrorMetric[];
}

export interface LearningPulsePoint {
  day: string;
  score: number;
}

export interface LearningPulseData {
  predicted_score: number;
  weekly_delta: number;
  points: LearningPulsePoint[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export interface QuestionTypeStat {
  name: string; // e.g., 'True/False/NG', 'Multiple Choice'
  accuracy: number;
  full?: number;
}

export interface TimeDataPoint {
  name: string;
  hours: number;
}

export interface StrategicDirective {
  title: string;
  description: string;
}

export interface AnalysisOverviewData {
  time_data: TimeDataPoint[];
  question_type_data: QuestionTypeStat[];
  foundation_stats: {
    new_words: number;
    syntax_patterns: number;
  };
  directives: StrategicDirective[];
}

export interface MemoryCurvePoint {
  day: string;
  retention: number;
}

export interface RecentWord {
  word: string;
  part_of_speech?: string;
  days_ago?: number;
  mastery_level?: number;
}

export interface SyntaxEntry {
  tag: string;
  sentence: string;
  analysis_label: string;
  analysis_text: string;
  added_at?: string;
  cta?: string;
}

export interface FoundationOverviewData {
  review_count: number;
  memory_curve: MemoryCurvePoint[];
  recent_words: RecentWord[];
  syntax_entries: SyntaxEntry[];
}

export interface WeaknessModule {
  id: string;
  name: string;
  score: number;
  weak_point: string;
}

export interface WeaknessStat {
  type: string;
  accuracy: number;
  color: string;
}

export interface WeaknessSuggestion {
  priority: string;
  issue: string;
  action1: string;
  action2: string;
}

export interface WeaknessOverviewData {
  modules: WeaknessModule[];
  detailed_stats: Record<string, WeaknessStat[]>;
  suggestions: Record<string, WeaknessSuggestion>;
}

export interface PracticeModule {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  tag_color: string;
  gradient: string;
}

export interface ReadingExamQuestion {
  id: number;
  text: string;
  options: string[];
  correct: string;
  analysis: string;
  keywords: string[];
}

export interface ReadingExamData {
  title: string;
  passage: string;
  question: ReadingExamQuestion;
}

export interface AIDrill {
  source: string;
  question: string;
  options: string[];
  context: string;
  logic: string;
  correct: string;
}

export interface PracticeOverviewData {
  modules: PracticeModule[];
  reading_exam: ReadingExamData;
  ai_drills: AIDrill[];
}

export interface DashboardData {
  learning_pulse: LearningPulseData;
  error_metrics: ErrorMetricsData;
  recommendations: Recommendation[];
}
