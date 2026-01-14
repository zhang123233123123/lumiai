"""
LumiAI - AI 服务（封装 DeepSeek API）
"""
from typing import List, Dict, Optional

import httpx

from app.config import get_settings

settings = get_settings()

DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-chat"
REQUEST_TIMEOUT = 30.0


def _require_api_key() -> None:
    if not settings.deepseek_api_key:
        raise ValueError("DEEPSEEK_API_KEY 未配置")


def _map_role(role: str) -> str:
    if role in {"assistant", "model"}:
        return "assistant"
    if role == "system":
        return "system"
    return "user"


async def _chat_completion(
    messages: List[Dict[str, str]],
    temperature: float,
    max_tokens: int,
) -> str:
    _require_api_key()

    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    headers = {
        "Authorization": f"Bearer {settings.deepseek_api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(
        base_url=DEEPSEEK_BASE_URL, timeout=REQUEST_TIMEOUT
    ) as client:
        response = await client.post("/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

    choices = data.get("choices", [])
    if not choices:
        raise ValueError("DeepSeek 返回空结果")

    content = choices[0].get("message", {}).get("content", "")
    if not content:
        raise ValueError("DeepSeek 返回空内容")

    return content.strip()


# 系统提示词
TUTOR_SYSTEM_PROMPT = """你叫 Lumina，是一位雅思(IELTS)备考专家 AI 导师。
你的目标是帮助学生提高雅思成绩。
请用中文与学生交流，但当涉及到具体的英语例句或修改时，请保留英文。
你的语气应该是专业、鼓励和温和的，像一位高端私人教练。
重点关注语法、词汇和逻辑流。
回答要简洁明了，不要长篇大论，除非学生要求详细解释。"""


async def chat_with_ai(message: str, history: Optional[List[Dict]] = None) -> str:
    """
    与 AI 导师对话

    Args:
        message: 用户消息
        history: 对话历史 [{"role": "user/model", "content": "..."}]

    Returns:
        AI 响应文本
    """
    try:
        messages: List[Dict[str, str]] = [
            {"role": "system", "content": TUTOR_SYSTEM_PROMPT}
        ]

        if history:
            for h in history[-8:]:
                messages.append(
                    {"role": _map_role(h.get("role", "")), "content": h.get("content", "")}
                )

        messages.append({"role": "user", "content": message})

        return await _chat_completion(
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
        )
    except Exception as e:
        print(f"DeepSeek API 错误: {e}")
        return f"很抱歉，处理您的请求时出现了错误: {str(e)}"


async def analyze_error(question_content: str, correct_answer: str, user_answer: str) -> Dict:
    """
    分析用户的错误答案

    Returns:
        {
            "error_type": "grammar/logic/vocabulary",
            "analysis": "错误分析",
            "correction": "纠正建议"
        }
    """
    try:
        prompt = f"""分析以下雅思题目的错误答案，并提供专业的诊断：

题目内容：
{question_content}

正确答案：{correct_answer}
学生答案：{user_answer}

请用以下 JSON 格式回复（只返回 JSON，不要其他内容）：
{{
    "error_type": "grammar 或 logic 或 vocabulary 或 other",
    "analysis": "用中文简洁分析错误原因（1-2句话）",
    "correction": "用中文给出纠正建议（1-2句话）"
}}"""

        text = await _chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=512,
        )

        import json

        # 移除可能的 markdown 代码块标记
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text.rsplit("```", 1)[0]
        text = text.strip()

        result = json.loads(text)
        return result

    except Exception as e:
        print(f"错误分析失败: {e}")
        return {
            "error_type": "unknown",
            "analysis": "暂时无法生成分析",
            "correction": "请稍后重试",
        }


async def generate_similar_question(original_question: str, error_type: str) -> str:
    """
    根据错题生成相似的练习题
    """
    try:
        prompt = f"""作为雅思考试专家，请根据以下原题和错误类型，生成一道相似的练习题：

原题：
{original_question}

错误类型：{error_type}

请生成一道有针对性的练习题，帮助学生克服这类错误。
格式要求：
1. 先给出题目
2. 然后在括号中给出简短提示
3. 不要给出答案"""

        return await _chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=512,
        )

    except Exception as e:
        print(f"生成相似题失败: {e}")
        return f"生成失败: {str(e)}"
