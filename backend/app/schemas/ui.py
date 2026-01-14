"""
LumiAI - UI 聚合接口 Schema
"""
from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel

from app.schemas.analysis import RecommendationItem

class LearningPulsePoint(BaseModel):
    day: str
    score: float


class LearningPulseResponse(BaseModel):
    predicted_score: float
    weekly_delta: float
    points: List[LearningPulsePoint]


class ErrorMetric(BaseModel):
    name: str
    value: int
    color: str


class ErrorMetricsResponse(BaseModel):
    pending_count: int
    metrics: List[ErrorMetric]


class QuestionTypeStat(BaseModel):
    name: str
    accuracy: int
    full: int = 100


class TimeDataPoint(BaseModel):
    name: str
    hours: float


class FoundationStats(BaseModel):
    new_words: int
    syntax_patterns: int


class StrategicDirective(BaseModel):
    title: str
    description: str


class AnalysisOverviewResponse(BaseModel):
    time_data: List[TimeDataPoint]
    question_type_data: List[QuestionTypeStat]
    foundation_stats: FoundationStats
    directives: List[StrategicDirective]


class MemoryCurvePoint(BaseModel):
    day: str
    retention: int


class RecentWord(BaseModel):
    word: str
    part_of_speech: Optional[str] = None
    days_ago: Optional[int] = None
    mastery_level: Optional[int] = None


class SyntaxEntry(BaseModel):
    tag: str
    sentence: str
    analysis_label: str
    analysis_text: str
    added_at: Optional[datetime] = None
    cta: Optional[str] = None


class FoundationOverviewResponse(BaseModel):
    review_count: int
    memory_curve: List[MemoryCurvePoint]
    recent_words: List[RecentWord]
    syntax_entries: List[SyntaxEntry]


class WeaknessModule(BaseModel):
    id: str
    name: str
    score: float
    weak_point: str


class WeaknessStat(BaseModel):
    type: str
    accuracy: int
    color: str


class WeaknessSuggestion(BaseModel):
    priority: str
    issue: str
    action1: str
    action2: str


class WeaknessOverviewResponse(BaseModel):
    modules: List[WeaknessModule]
    detailed_stats: Dict[str, List[WeaknessStat]]
    suggestions: Dict[str, WeaknessSuggestion]


class PracticeModule(BaseModel):
    id: str
    title: str
    subtitle: str
    tag: str
    color: str
    tag_color: str
    gradient: str


class ReadingExamQuestion(BaseModel):
    id: int
    text: str
    options: List[str]
    correct: str
    analysis: str
    keywords: List[str]


class ReadingExamResponse(BaseModel):
    title: str
    passage: str
    question: ReadingExamQuestion


class AIDrill(BaseModel):
    source: str
    question: str
    options: List[str]
    context: str
    logic: str
    correct: str


class PracticeOverviewResponse(BaseModel):
    modules: List[PracticeModule]
    reading_exam: ReadingExamResponse
    ai_drills: List[AIDrill]


class DashboardResponse(BaseModel):
    learning_pulse: LearningPulseResponse
    error_metrics: ErrorMetricsResponse
    recommendations: List[RecommendationItem]
