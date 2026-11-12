
const assert = require("node:assert/strict");
const path = require("node:path");

// Load backend environment variables.
require("dotenv").config({
    path: path.resolve(__dirname, "./.env"),
});

MONGO_URI="mongodb+srv://sawantpranay97_db_user:RZo4FLB99dYicFzW@cluster0.ho2j3pj.mongodb.net/agentic-ai-test?appName=Cluster0"

const testMongoUri = MONGO_URI;

if (!testMongoUri) {
    throw new Error(
        "TEST_MONGO_URI is missing. Configure a dedicated test database before running this script."
    );
}

// Safety check: refuse to run against a database whose name doesn't contain "test".
const databaseName = new URL(testMongoUri).pathname.replace("/", "");

if (!databaseName || !databaseName.toLowerCase().includes("test")) {
    throw new Error(
        `Unsafe database name "${databaseName}". The database name must contain "test".`
    );
}

// Reuse the application's existing database connection function.
// Set MONGO_URI before requiring the config/database module.
process.env.MONGO_URI = testMongoUri;

const mongoose = require("mongoose");
const { connectDb } = require("./src/config/database");

const { Document } = require("./src/models/document.model");
const { ConversationThread } = require("./src/models/conversationThread.model");
const { ConversationMessage } = require("./src/models/conversationMessage.model");

const {
    createThread,
    fetchThread,
    fetchAllThreads,
    deleteThread,
} = require("./src/repositories/conversationThread.repository");

const {
    createMessage,
    fetchMessage,
    fetchAllMessages,
    deleteMessage,
} = require("./src/repositories/conversationMessage.repository");

const testUserId = new mongoose.Types.ObjectId();
const anotherUserId = new mongoose.Types.ObjectId();

let testDocumentId;
const threadIds = [];
const messageIds = [];

const logPass = (description) => {
    console.log(`  PASS: ${description}`);
};

const runTests = async () => {
    try {
        console.log("\nConnecting to test database...");
        await connectDb();
        console.log("Connected.\n");

        // Create a temporary document for repository tests.
        const document = await Document.create({
            fileName: "repository-smoke-test.pdf",
            filePath: "/tmp/repository-smoke-test.pdf",
            mimeType: "application/pdf",
            size: 1024,
            status: "READY",
            userId: testUserId,
        });

        testDocumentId = document._id;

        console.log("Testing ConversationThread repository...");

        // 1. Create thread.
        const thread1 = await createThread({
            documentId: testDocumentId,
            userId: testUserId,
            title: "Test Conversation 1",
        });

        threadIds.push(thread1._id);
        assert.ok(thread1._id);
        assert.equal(thread1.title, "Test Conversation 1");
        logPass("Create thread");

        // 2. Fetch thread belonging to the correct user.
        const fetchedThread = await fetchThread(thread1._id, testUserId);

        assert.ok(fetchedThread);
        assert.equal(fetchedThread._id.toString(), thread1._id.toString());
        logPass("Fetch thread by threadId and userId");

        // 3. Verify another user cannot fetch this thread.
        const unauthorizedThread = await fetchThread(
            thread1._id,
            anotherUserId
        );

        assert.equal(unauthorizedThread, null);
        logPass("Thread fetch with incorrect userId returns null");

        // 4. Create a second thread for the same document.
        const thread2 = await createThread({
            documentId: testDocumentId,
            userId: testUserId,
            title: "Test Conversation 2",
        });

        threadIds.push(thread2._id);
        logPass("Create multiple threads for the same document");

        // 5. Verify thread filtering and ordering.
        // Set controlled timestamps so the ordering test doesn't depend on timing.
        const olderDate = new Date("2026-01-01T10:00:00.000Z");
        const newerDate = new Date("2026-01-02T10:00:00.000Z");

        await ConversationThread.updateOne(
            { _id: thread1._id },
            { $set: { updatedAt: olderDate } }
        );

        await ConversationThread.updateOne(
            { _id: thread2._id },
            { $set: { updatedAt: newerDate } }
        );

        const threads = await fetchAllThreads(testUserId, testDocumentId);

        assert.equal(threads.length, 2);
        assert.equal(threads[0]._id.toString(), thread2._id.toString());
        assert.equal(threads[1]._id.toString(), thread1._id.toString());
        logPass("Fetch threads filtered by userId and documentId, newest first");

        // 6. Verify another user's threads are not returned.
        const otherUsersThreads = await fetchAllThreads(
            anotherUserId,
            testDocumentId
        );

        assert.equal(otherUsersThreads.length, 0);
        logPass("Thread listing is scoped to userId");

        console.log("\nTesting ConversationMessage repository...");

        // 7. Create messages.
        const message1 = await createMessage({
            threadId: thread1._id,
            role: "user",
            content: "What is this document about?",
        });

        messageIds.push(message1._id);

        const message2 = await createMessage({
            threadId: thread1._id,
            role: "assistant",
            content: "This document describes the test scenario.",
            evidence: [],
        });

        messageIds.push(message2._id);

        assert.ok(message1._id);
        assert.ok(message2._id);
        logPass("Create user and assistant messages");

        // 8. Fetch a message within its thread.
        const fetchedMessage = await fetchMessage(
            message1._id,
            thread1._id
        );

        assert.ok(fetchedMessage);
        assert.equal(fetchedMessage.content, "What is this document about?");
        logPass("Fetch message by messageId and threadId");

        // 9. Verify a message cannot be fetched using a different threadId.
        const wrongThreadMessage = await fetchMessage(
            message1._id,
            thread2._id
        );

        assert.equal(wrongThreadMessage, null);
        logPass("Message fetch with incorrect threadId returns null");

        // 10. Verify messages are returned chronologically.
        const earlierDate = new Date("2026-01-01T10:00:00.000Z");
        const laterDate = new Date("2026-01-01T10:01:00.000Z");

        await ConversationMessage.updateOne(
            { _id: message1._id },
            { $set: { createdAt: earlierDate } }
        );

        await ConversationMessage.updateOne(
            { _id: message2._id },
            { $set: { createdAt: laterDate } }
        );

        const messages = await fetchAllMessages(thread1._id);

        assert.equal(messages.length, 2);
        assert.equal(messages[0]._id.toString(), message1._id.toString());
        assert.equal(messages[1]._id.toString(), message2._id.toString());
        logPass("Fetch messages in chronological order");

        // 11. Verify messages are scoped to their thread.
        const otherThreadsMessages = await fetchAllMessages(thread2._id);

        assert.equal(otherThreadsMessages.length, 0);
        logPass("Message listing is scoped to threadId");

        // 12. Delete message.
        const deletedMessage = await deleteMessage(
            message1._id,
            thread1._id
        );

        assert.ok(deletedMessage);
        assert.equal(
            await fetchMessage(message1._id, thread1._id),
            null
        );
        logPass("Delete message");

        // 13. Delete thread.
        const deletedThread = await deleteThread(
            thread1._id,
            testUserId
        );

        assert.ok(deletedThread);
        assert.equal(await fetchThread(thread1._id, testUserId), null);
        logPass("Delete thread");

        // 14. Verify another user cannot delete a thread.
        const unauthorizedDelete = await deleteThread(
            thread2._id,
            anotherUserId
        );

        assert.equal(unauthorizedDelete, null);
        assert.ok(await fetchThread(thread2._id, testUserId));
        logPass("Thread deletion with incorrect userId does not delete thread");

        console.log("\nAll repository smoke tests passed.");
    } catch (error) {
        console.error("\nRepository smoke test failed:");
        console.error(error);
        process.exitCode = 1;
    } finally {
        console.log("\nCleaning up test records...");

        try {
            if (threadIds.length > 0) {
                // Delete only messages belonging to the test threads.
                await ConversationMessage.deleteMany({
                    threadId: { $in: threadIds },
                });

                await ConversationThread.deleteMany({
                    _id: { $in: threadIds },
                });
            }

            if (testDocumentId) {
                await Document.deleteOne({ _id: testDocumentId });
            }

            console.log("Test records cleaned up.");
        } catch (cleanupError) {
            console.error("Cleanup failed:", cleanupError);
            process.exitCode = 1;
        }

        await mongoose.disconnect();
        console.log("Database connection closed.");
    }
};

runTests();
