const {
  FAST_API_URL
} = require("../config/env");
const { logger } = require("../config/logger");

const getAIAnswer = async (message, documentId) => {
  const baseUrl = `${FAST_API_URL}/generate-answer`;

  try {
    const aiResponse = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        documentId
      })
    });

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();

      logger.error(
        `AI service HTTP error: ${aiResponse.status}`,
        errorBody
      );

      return {
        success: false,
        message: `AI service returned HTTP ${aiResponse.status}`
      };
    }

    const data = await aiResponse.json();

    if (!data?.success || !data?.answer?.trim()) {
      return {
        success: false,
        message: data?.message || "AI response generation failed"
      };
    }

    return {
      success: true,
      answer: data.answer,
      matches: Array.isArray(data.matches) ? data.matches : []
    };

  } catch (error) {
    logger.error("AI service communication error", error);

    return {
      success: false,
      message: "AI service is unavailable"
    };
  }
};


module.exports = {
  getAIAnswer
};