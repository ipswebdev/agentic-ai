const { success, failure } = require("../utils/response.utils");
const { isValidObjectId } = require("../utils/id.utils");
const { logger } = require("../config/logger");

const { getAIAnswer } = require("../services/chat.service");
const {
  fetchConversationThreadById
} = require("../services/conversationThread.service");

const { storeMessage } = require("../services/conversationMessage.service");
const {
  updateThreadActivity
} = require("../repositories/conversationThread.repository");


const sendMessage = async (req, res) => {
  const user = req.user;
  const { threadId } = req.body || {};

  const message =
    typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

  // Validate request input.
  if (!message) {
    return failure(res, "A valid message is required", 400);
  }

  if (!isValidObjectId(threadId)) {
    return failure(res, "Invalid thread ID", 400);
  }

  // Validate authenticated user.
  if (!user?.id) {
    return failure(res, "Unauthorized", 401);
  }

  try {
    // Fetch thread and verify ownership.
    const threadDetails = await fetchConversationThreadById(
      threadId,
      user.id
    );

    if (!threadDetails?.success || !threadDetails?.data?.documentId) {
      return failure(res, "Thread not found", 404);
    }

    // Persist the user's message before calling AI.
    const storedMessage = await storeMessage(
      threadId,
      "user",
      message,
      []
    );

    if (!storedMessage?.success) {
      return failure(res, "Unable to save user message", 500);
    }

    // Update activity as soon as the user's message is persisted.
    const updatedThreadActivity = await updateThreadActivity(
      threadId,
      user.id
    );

    if (!updatedThreadActivity) {
      return failure(res, "Thread no longer exists", 404);
    }

    // Generate AI response.
    const aiResponse = await getAIAnswer(
      message,
      threadDetails.data.documentId
    );

    if (!aiResponse?.success) {
      logger.error(
        "AI response generation failed",
        aiResponse?.message
      );

      return failure(
        res,
        "Unable to generate an AI response. Your message has been saved.",
        502
      );
    }

    const answer = aiResponse.answer;
    const evidence = Array.isArray(aiResponse.matches)
      ? aiResponse.matches
      : [];

    // Persist assistant response.
    const storedAnswer = await storeMessage(
      threadId,
      "assistant",
      answer,
      evidence
    );

    if (!storedAnswer?.success) {
      return failure(
        res,
        "AI response generated, but unable to save the response",
        500
      );
    }

    return success(
      res,
      {
        answer,
        matches: evidence,
        message: storedAnswer.data
      },
      "Answer generated successfully",
      200
    );

  } catch (err) {
    logger.error("Error processing chat message", err);

    return failure(
      res,
      "Unable to process your message",
      500
    );
  }
};


module.exports = {
  sendMessage
};