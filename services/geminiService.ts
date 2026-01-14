/**
 * LumiAI - Gemini 服务（通过后端 API 调用）
 * 
 * 此文件已重构为调用后端 API，不再直接调用 Gemini
 * API Key 安全地存储在后端
 */

// 后端 API 基础地址
const BACKEND_URL = 'http://localhost:8000';

// 保持与原接口兼容的导出
export const initializeChat = async (): Promise<boolean> => {
  // 后端会自动管理会话，这里只需检查后端是否可用
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error("Failed to connect to backend:", error);
    return false;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || "我明白了，但我暂时无法生成回答。";
  } catch (error) {
    console.error("Error sending message to backend:", error);
    return "很抱歉，处理您的请求时出现了错误。请确保后端服务正在运行。";
  }
};