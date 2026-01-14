"""
LumiAI - UI 聚合数据路由
"""
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends

from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.analysis import RecommendationItem
from app.schemas.ui import (
    AIDrill,
    AnalysisOverviewResponse,
    DashboardResponse,
    ErrorMetric,
    ErrorMetricsResponse,
    FoundationOverviewResponse,
    FoundationStats,
    LearningPulsePoint,
    LearningPulseResponse,
    MemoryCurvePoint,
    PracticeModule,
    PracticeOverviewResponse,
    QuestionTypeStat,
    ReadingExamQuestion,
    ReadingExamResponse,
    RecentWord,
    StrategicDirective,
    SyntaxEntry,
    TimeDataPoint,
    WeaknessModule,
    WeaknessOverviewResponse,
    WeaknessStat,
    WeaknessSuggestion,
)

router = APIRouter()


LEARNING_PULSE_POINTS = [
    LearningPulsePoint(day="周一", score=6.5),
    LearningPulsePoint(day="周二", score=6.8),
    LearningPulsePoint(day="周三", score=6.7),
    LearningPulsePoint(day="周四", score=7.2),
    LearningPulsePoint(day="周五", score=7.0),
    LearningPulsePoint(day="周六", score=7.5),
    LearningPulsePoint(day="周日", score=7.8),
]

ERROR_METRICS = [
    ErrorMetric(name="复杂语法", value=45, color="#0071e3"),
    ErrorMetric(name="词汇缺口", value=30, color="#5e5ce6"),
    ErrorMetric(name="逻辑陷阱", value=15, color="#32ade6"),
    ErrorMetric(name="格式错误", value=10, color="#e5e5ea"),
]

RECOMMENDATIONS = [
    RecommendationItem(
        id="1",
        title="高级定语从句应用",
        category="Writing",
        duration="15 分钟",
        difficulty="Hard",
        reason="基于您近期的语法错误",
    ),
    RecommendationItem(
        id="2",
        title="Part 2 独白模拟",
        category="Speaking",
        duration="10 分钟",
        difficulty="Medium",
        reason="提升口语流利度",
    ),
    RecommendationItem(
        id="3",
        title="学术摘要快速定位",
        category="Reading",
        duration="20 分钟",
        difficulty="Hard",
        reason="强化阅读逻辑推理",
    ),
]

TIME_DATA = [
    TimeDataPoint(name="Listening", hours=12.5),
    TimeDataPoint(name="Reading", hours=15.2),
    TimeDataPoint(name="Writing", hours=8.4),
    TimeDataPoint(name="Speaking", hours=5.1),
]

QUESTION_TYPE_DATA = [
    QuestionTypeStat(name="T/F/NG", accuracy=45),
    QuestionTypeStat(name="Multiple Choice", accuracy=65),
    QuestionTypeStat(name="Matching", accuracy=78),
    QuestionTypeStat(name="Fill-in", accuracy=88),
]

DIRECTIVES = [
    StrategicDirective(
        title="Repair Logic Circuits",
        description="Dedicate 30% of next week's Reading time specifically to True/False/Not Given drills in the Weakness module.",
    ),
    StrategicDirective(
        title="Expand Vocab Database",
        description="Focus on \"Environmental\" topic words. Your precision in C19T3P1 was low due to synonym misses.",
    ),
]

MEMORY_CURVE = [
    MemoryCurvePoint(day="1m", retention=100),
    MemoryCurvePoint(day="20m", retention=58),
    MemoryCurvePoint(day="1h", retention=44),
    MemoryCurvePoint(day="9h", retention=36),
    MemoryCurvePoint(day="1d", retention=33),
    MemoryCurvePoint(day="2d", retention=28),
    MemoryCurvePoint(day="6d", retention=25),
    MemoryCurvePoint(day="31d", retention=21),
]

RECENT_WORDS = [
    RecentWord(word="Ubiquitous", part_of_speech="Adj.", days_ago=3, mastery_level=3),
    RecentWord(word="Ephemeral", part_of_speech="Adj.", days_ago=2, mastery_level=2),
    RecentWord(word="Resilient", part_of_speech="Adj.", days_ago=5, mastery_level=4),
    RecentWord(word="Paradigm", part_of_speech="N.", days_ago=4, mastery_level=3),
    RecentWord(word="Alleviate", part_of_speech="V.", days_ago=1, mastery_level=2),
]

SYNTAX_ENTRIES = [
    SyntaxEntry(
        tag="Inversion (倒装)",
        sentence="Never before had the concept of interstellar travel seemed so plausible yet so distant.",
        analysis_label="Structure",
        analysis_text="Negative Adverb + Auxiliary + Subject + Main Verb",
        added_at=datetime.utcnow(),
        cta="View Similar Sentences →",
    ),
    SyntaxEntry(
        tag="Participle Clause",
        sentence="Facing extreme gravitational forces, the crew had to rely on automated systems.",
        analysis_label="Logic",
        analysis_text="Cause and Effect. (Because they faced...)",
        added_at=datetime.utcnow() - timedelta(days=1),
        cta="View Similar Sentences →",
    ),
]

WEAKNESS_MODULES = [
    WeaknessModule(id="Listening", name="Listening", score=6.5, weak_point="Multiple Choice"),
    WeaknessModule(id="Reading", name="Reading", score=7.0, weak_point="True/False/NG"),
    WeaknessModule(id="Writing", name="Writing", score=6.0, weak_point="Coherence"),
    WeaknessModule(id="Speaking", name="Speaking", score=6.5, weak_point="Fluency"),
]

DETAILED_STATS = {
    "Listening": [
        WeaknessStat(type="Multiple Choice", accuracy=55, color="#f59e0b"),
        WeaknessStat(type="Map Labeling", accuracy=65, color="#f59e0b"),
        WeaknessStat(type="Form Completion", accuracy=92, color="#22c55e"),
        WeaknessStat(type="Matching", accuracy=70, color="#22c55e"),
    ],
    "Reading": [
        WeaknessStat(type="True/False/NG", accuracy=45, color="#ef4444"),
        WeaknessStat(type="Heading Match", accuracy=62, color="#f59e0b"),
        WeaknessStat(type="Summary Completion", accuracy=88, color="#22c55e"),
        WeaknessStat(type="Multiple Choice", accuracy=55, color="#f59e0b"),
    ],
    "Writing": [
        WeaknessStat(type="Task Response", accuracy=68, color="#f59e0b"),
        WeaknessStat(type="Coherence", accuracy=48, color="#ef4444"),
        WeaknessStat(type="Lexical Resource", accuracy=72, color="#22c55e"),
        WeaknessStat(type="Grammar", accuracy=65, color="#f59e0b"),
    ],
    "Speaking": [
        WeaknessStat(type="Fluency", accuracy=58, color="#ef4444"),
        WeaknessStat(type="Pronunciation", accuracy=75, color="#22c55e"),
        WeaknessStat(type="Lexical Resource", accuracy=68, color="#f59e0b"),
        WeaknessStat(type="Grammar", accuracy=65, color="#f59e0b"),
    ],
}

WEAKNESS_SUGGESTIONS = {
    "Listening": WeaknessSuggestion(
        priority="Attention Required",
        issue="Distractors in Multiple Choice questions are causing a 40% error rate. You tend to select the first option mentioned without waiting for the 'turn'.",
        action1="Drill 'Distractor Recognition'",
        action2="Practice 'Wait for the Turn'",
    ),
    "Reading": WeaknessSuggestion(
        priority="High Priority",
        issue="True/False/Not Given logic circuits are failing consistently on 'Not Given' inference. You are confusing 'Absence of Info' with 'False'.",
        action1="Drill 20 T/F/NG Logic Gates",
        action2="Review Logic Failures Archive",
    ),
    "Writing": WeaknessSuggestion(
        priority="Critical Alert",
        issue="Coherence scores are suffering due to lack of clear topic sentences in body paragraphs. Paragraph transitions are abrupt.",
        action1="Structure 5 Body Paragraphs",
        action2="Review Linking Words",
    ),
    "Speaking": WeaknessSuggestion(
        priority="Moderate Priority",
        issue="Fluency is interrupted by excessive self-correction in Part 2. You are pausing too often to search for perfect vocabulary.",
        action1="Shadowing Practice (Speed)",
        action2="Learn 10 Filler Phrases",
    ),
}

PRACTICE_MODULES = [
    PracticeModule(
        id="listening",
        title="Listening",
        subtitle="Cambridge 18 Test 4",
        tag="Section 4 Focus",
        color="bg-blue-100 text-blue-600",
        tag_color="bg-blue-100 text-blue-700",
        gradient="from-blue-400 to-indigo-500",
    ),
    PracticeModule(
        id="reading",
        title="Reading",
        subtitle="C19 Test 3 Passage 1",
        tag="T/F/NG Special",
        color="bg-orange-100 text-orange-600",
        tag_color="bg-orange-100 text-orange-700",
        gradient="from-amber-400 to-orange-500",
    ),
    PracticeModule(
        id="writing",
        title="Writing",
        subtitle="Task 2: Globalisation",
        tag="Argumentation",
        color="bg-purple-100 text-purple-600",
        tag_color="bg-purple-100 text-purple-700",
        gradient="from-purple-400 to-pink-500",
    ),
    PracticeModule(
        id="speaking",
        title="Speaking",
        subtitle="Part 2: Technology",
        tag="Fluency Drill",
        color="bg-green-100 text-green-600",
        tag_color="bg-green-100 text-green-700",
        gradient="from-emerald-400 to-teal-500",
    ),
]

READING_PASSAGE = (
    "Roughly 11,700 years ago, as the most recent ice age ended, the climate became "
    "significantly warmer and wetter, no doubt making Obi's jungle much thicker. "
    "According to the researchers, it is no coincidence that around this time the first "
    "axes crafted from stone rather than sea shells appear, likely in response to their "
    "heavy-duty use for clearing and modification of the increasingly dense rainforest. "
    "While stone takes about twice as long to grind into an axe compared to shell, the "
    "harder material keeps its sharp edge for longer."
)

READING_QUESTION = ReadingExamQuestion(
    id=4,
    text=(
        "A change in the climate around 11,700 years ago had a greater impact on Obi "
        "than on the surrounding islands."
    ),
    options=["TRUE", "FALSE", "NOT GIVEN"],
    correct="NOT GIVEN",
    analysis=(
        "原文提到了11700年前气候变暖变湿让Obi的丛林变厚，但并没有将Obi受到的影响"
        "与周围岛屿进行比较。题目中的比较关系在原文中不存在。"
    ),
    keywords=["11,700 years ago", "Obi", "surrounding islands"],
)

AI_DRILLS = [
    AIDrill(
        source="C19T4P1 - Q4",
        question="Some species of butterfly have a reduced lifespan due to spring temperature increases.",
        options=["TRUE", "FALSE", "NOT GIVEN"],
        context=(
            "In Britain, as the average spring temperature has increased by roughly 0.5 °C "
            "over the past 20 years, species have advanced by between three days and a week on average..."
        ),
        logic="原文只提到了蝴蝶为了适应温度提前出现，并未提及寿命缩短。属于典型的无中生有。",
        correct="NOT GIVEN",
    ),
    AIDrill(
        source="C19T2P1 - Q10",
        question=(
            "Samuel Morse's communication system was more reliable than that developed by "
            "William Cooke and Charles Wheatstone."
        ),
        options=["TRUE", "FALSE", "NOT GIVEN"],
        context=(
            "In 1837, British inventors William Cooke and Charles Wheatstone patented the "
            "first commercial telegraphy system... Samuel Morse and other inventors worked "
            "on their own versions..."
        ),
        logic="原文提到了两人分别发明了系统，但完全没有比较两者的可靠性。",
        correct="NOT GIVEN",
    ),
]


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard_ui(
    current_user: User = Depends(get_current_user),
):
    """Dashboard 页面聚合数据"""
    _ = current_user
    return DashboardResponse(
        learning_pulse=LearningPulseResponse(
            predicted_score=7.5,
            weekly_delta=0.3,
            points=LEARNING_PULSE_POINTS,
        ),
        error_metrics=ErrorMetricsResponse(
            pending_count=12,
            metrics=ERROR_METRICS,
        ),
        recommendations=RECOMMENDATIONS,
    )


@router.get("/analysis", response_model=AnalysisOverviewResponse)
async def get_analysis_ui(
    current_user: User = Depends(get_current_user),
):
    """分析页面聚合数据"""
    _ = current_user
    return AnalysisOverviewResponse(
        time_data=TIME_DATA,
        question_type_data=QUESTION_TYPE_DATA,
        foundation_stats=FoundationStats(new_words=124, syntax_patterns=18),
        directives=DIRECTIVES,
    )


@router.get("/foundation", response_model=FoundationOverviewResponse)
async def get_foundation_ui(
    current_user: User = Depends(get_current_user),
):
    """核心能力页面聚合数据"""
    _ = current_user
    return FoundationOverviewResponse(
        review_count=42,
        memory_curve=MEMORY_CURVE,
        recent_words=RECENT_WORDS,
        syntax_entries=SYNTAX_ENTRIES,
    )


@router.get("/weakness", response_model=WeaknessOverviewResponse)
async def get_weakness_ui(
    current_user: User = Depends(get_current_user),
):
    """薄弱点页面聚合数据"""
    _ = current_user
    return WeaknessOverviewResponse(
        modules=WEAKNESS_MODULES,
        detailed_stats=DETAILED_STATS,
        suggestions=WEAKNESS_SUGGESTIONS,
    )


@router.get("/practice", response_model=PracticeOverviewResponse)
async def get_practice_ui(
    current_user: User = Depends(get_current_user),
):
    """练习页面聚合数据"""
    _ = current_user
    return PracticeOverviewResponse(
        modules=PRACTICE_MODULES,
        reading_exam=ReadingExamResponse(
            title="The Impact of Climate Change on Obi",
            passage=READING_PASSAGE,
            question=READING_QUESTION,
        ),
        ai_drills=AI_DRILLS,
    )
