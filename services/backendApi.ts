/**
 * LumiAI - API 服务封装（供前端调用后端）
 * 这个文件展示如何从前端调用后端 API
 */

// 后端 API 基础地址
const BACKEND_URL = 'http://localhost:8000';

/**
 * 发送消息给 AI 导师
 */
export const sendMessageToBackend = async (message: string): Promise<string> => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error calling backend:', error);
        throw error;
    }
};

/**
 * 获取题目列表
 */
export const getQuestions = async (category?: string, limit: number = 10) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());

    const response = await fetch(`${BACKEND_URL}/api/questions?${params}`);
    return response.json();
};

/**
 * 获取随机题目
 */
export const getRandomQuestion = async (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);

    const response = await fetch(`${BACKEND_URL}/api/questions/random?${params}`);
    return response.json();
};

/**
 * 提交答案
 */
export const submitAnswer = async (sessionId: number, questionId: number, userAnswer: string) => {
    const response = await fetch(`${BACKEND_URL}/api/practice/sessions/${sessionId}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question_id: questionId,
            user_answer: userAnswer,
        }),
    });
    return response.json();
};

/**
 * 获取错题列表
 */
export const getErrors = async (limit: number = 10) => {
    const response = await fetch(`${BACKEND_URL}/api/analysis/errors?limit=${limit}`);
    return response.json();
};

/**
 * 获取学习统计
 */
export const getLearningStats = async () => {
    const response = await fetch(`${BACKEND_URL}/api/analysis/stats`);
    return response.json();
};

/**
 * 获取技能雷达图数据
 */
export const getSkillScores = async () => {
    const response = await fetch(`${BACKEND_URL}/api/analysis/skills`);
    return response.json();
};

/**
 * 获取推荐练习
 */
export const getRecommendations = async () => {
    const response = await fetch(`${BACKEND_URL}/api/analysis/recommendations`);
    return response.json();
};

/**
 * 获取练习历史
 */
export const getPracticeHistory = async (limit: number = 10) => {
    const response = await fetch(`${BACKEND_URL}/api/practice/history?limit=${limit}`);
    return response.json();
};

/**
 * 生词本操作
 */
export const vocabularyApi = {
    getAll: async () => {
        const response = await fetch(`${BACKEND_URL}/api/vocabulary`);
        return response.json();
    },

    add: async (word: string, definition?: string) => {
        const response = await fetch(`${BACKEND_URL}/api/vocabulary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word, definition }),
        });
        return response.json();
    },

    delete: async (id: number) => {
        const response = await fetch(`${BACKEND_URL}/api/vocabulary/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },
};

/**
 * 创建练习会话
 */
export const createPracticeSession = async (category: string, title?: string) => {
    const response = await fetch(`${BACKEND_URL}/api/practice/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title }),
    });
    return response.json();
};

/**
 * 完成练习会话
 */
export const completePracticeSession = async (sessionId: number, timeSpent: number = 0) => {
    const response = await fetch(`${BACKEND_URL}/api/practice/sessions/${sessionId}/complete?time_spent=${timeSpent}`, {
        method: 'POST',
    });
    return response.json();
};

/**
 * 获取题目详情
 */
export const getQuestionDetail = async (questionId: number) => {
    const response = await fetch(`${BACKEND_URL}/api/questions/${questionId}`);
    return response.json();
};

/**
 * 获取题目统计
 */
export const getQuestionCount = async () => {
    const response = await fetch(`${BACKEND_URL}/api/questions/count`);
    return response.json();
};

/**
 * 获取 AI 改进建议
 */
export const getAIImprovements = async () => {
    const response = await fetch(`${BACKEND_URL}/api/analysis/improvements`);
    return response.json();
};

/**
 * 生成相似题目
 */
export const generateSimilarQuestion = async (errorId: number) => {
    const response = await fetch(`${BACKEND_URL}/api/analysis/errors/${errorId}/generate-similar`, {
        method: 'POST',
    });
    return response.json();
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async () => {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`);
    return response.json();
};
