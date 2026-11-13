const { success, failure } = require("../utils/response.utils");
const { isValidObjectId } = require("../utils/id.utils");
const {
  ThreadFetchException,
  ThreadSaveException
} = require("../exceptions/repository.exception");
const { logger } = require("../config/logger");

const {
  getConversationThreads,
  createConversationThread,
  fetchConversationThreadById,
  deleteConversationThread
} = require("../services/conversationThread.service");

const { fetchMessages } = require("../services/conversationMessage.service");


const getThread = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return failure(res, "Invalid thread ID", 400);
  }

  try {
    const threadRes = await fetchConversationThreadById(id, req.user.id);

    if (!threadRes?.success) {
      return failure(res, "Thread not found", 404);
    }

    return success(
      res,
      threadRes.data,
      "Successfully fetched Thread",
      200
    );

  } catch (err) {
    logger.error("Error fetching Thread", err);

    if (err instanceof ThreadFetchException) {
      return failure(res, err.message, 500);
    }

    return failure(res, "Error fetching Thread", 500);
  }
};


const createNewThread = async (req, res) => {
  const { documentId, title } = req.body || {};

  if (typeof documentId !== "string" || !documentId.trim()) {
    return failure(res, "Valid document ID is required", 400);
  }

  if (!isValidObjectId(documentId)) {
    return failure(res, "Invalid document ID", 400);
  }

  try {
    const userThread = await createConversationThread(
      req.user.id,
      documentId,
      title
    );

    if (!userThread?.success || !userThread?.thread) {
      return failure(
        res,
        userThread?.message || "Could not create a Thread",
        400
      );
    }

    return success(
      res,
      userThread.thread,
      "Successfully Created Thread",
      201
    );

  } catch (err) {
    logger.error("Error creating thread", err);

    if (err instanceof ThreadSaveException) {
      return failure(res, err.message, 500);
    }

    return failure(res, "Error creating thread", 500);
  }
};


const deleteThread = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return failure(res, "Invalid thread ID", 400);
  }

  try {
    const deletedThread = await deleteConversationThread(id, req.user.id);

    if (!deletedThread?.success) {
      return failure(
        res,
        deletedThread?.message || "Thread not found",
        404
      );
    }

    return success(
      res,
      deletedThread.thread,
      "Successfully Deleted Thread",
      200
    );

  } catch (err) {
    logger.error("Error deleting thread", err);
    return failure(res, "Error deleting thread", 500);
  }
};


const getAllThreads = async (req, res) => {
  try {
    const userThreads = await getConversationThreads(req.user.id);

    return success(
      res,
      {
        threads: userThreads.threads
      },
      "Fetched Threads successfully",
      200
    );

  } catch (err) {
    logger.error("Error fetching Threads", err);
    return failure(res, "Error fetching Threads", 500);
  }
};


const getAllThreadMessages = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return failure(res, "Invalid thread ID", 400);
  }

  try {
    const threadRes = await fetchConversationThreadById(id, req.user.id);

    if (!threadRes?.success || !threadRes?.data?.id) {
      return failure(res, "Thread not found", 404);
    }

    const messageRes = await fetchMessages(threadRes.data.id);

    if (!messageRes?.success) {
      return failure(res, "Unable to fetch messages", 500);
    }

    return success(
      res,
      messageRes.data,
      "Successfully fetched messages",
      200
    );

  } catch (err) {
    logger.error("Error fetching thread messages", err);
    return failure(res, "Error fetching thread messages", 500);
  }
};


module.exports = {
  getThread,
  deleteThread,
  getAllThreads,
  createNewThread,
  getAllThreadMessages
};