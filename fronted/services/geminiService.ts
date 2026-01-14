import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in the environment.");
    // In a real app, handle this gracefully. For now, the app will likely fail if called.
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const initializeChat = async () => {
  try {
    const ai = getClient();
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `你叫 Lumina，是一位雅思(IELTS)备考专家 AI 导师。
        你的目标是帮助学生提高雅思成绩。
        请用中文与学生交流，但当涉及到具体的英语例句或修改时，请保留英文。
        你的语气应该是专业、鼓励和温和的，像一位高端私人教练。
        重点关注语法、词汇和逻辑流。
        回答要简洁明了，不要长篇大论，除非学生要求详细解释。`,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return false;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  if (!chatSession) {
     return "我现在无法连接网络，请检查API密钥配置。";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "我明白了，但我暂时无法生成回答。";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "很抱歉，处理您的请求时出现了错误。";
  }
};