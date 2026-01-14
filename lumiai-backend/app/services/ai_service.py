"""
LumiAI - AI 服务（封装 Google Gemini API）
"""
from google import genai
from google.genai import types
from app.config import get_settings
from typing import List, Dict, Optional

settings = get_settings()

# 初始化 Gemini 客户端
client = None

def get_client():
    """获取 Gemini 客户端"""
    global client
    if client is None:
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY 未配置")
        client = genai.Client(api_key=settings.gemini_api_key)
    return client


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
        ai_client = get_client()
        
        # 构建消息列表
        contents = []
        
        # 添加历史消息
        if history:
            for h in history[-8:]:  # 只保留最近 8 条
                contents.append(
                    types.Content(
                        role=h["role"],
                        parts=[types.Part(text=h["content"])]
                    )
                )
        
        # 添加当前消息
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part(text=message)]
            )
        )
        
        # 调用 API
        response = ai_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=TUTOR_SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=1024,
            )
        )
        
        return response.text or "我明白了，但我暂时无法生成回答。"
        
    except Exception as e:
        print(f"Gemini API 错误: {e}")
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
        ai_client = get_client()
        
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

        response = ai_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=512,
            )
        )
        
        # 解析 JSON
        import json
        text = response.text.strip()
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
            "correction": "请稍后重试"
        }


async def generate_similar_question(original_question: str, error_type: str) -> str:
    """
    根据错题生成相似的练习题
    """
    try:
        ai_client = get_client()
        
        prompt = f"""作为雅思考试专家，请根据以下原题和错误类型，生成一道相似的练习题：

原题：
{original_question}

错误类型：{error_type}

请生成一道有针对性的练习题，帮助学生克服这类错误。
格式要求：
1. 先给出题目
2. 然后在括号中给出简短提示
3. 不要给出答案"""

        response = ai_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.8,
                max_output_tokens=512,
            )
        )
        
        return response.text or "生成失败，请重试"
        
    except Exception as e:
        print(f"生成相似题失败: {e}")
        return f"生成失败: {str(e)}"
