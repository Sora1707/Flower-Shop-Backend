import mongoose from "mongoose";

async function withTransaction(fn: (session: mongoose.ClientSession) => Promise<void>) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await fn(session);
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction aborted:", error);
        throw error;
    } finally {
        await session.endSession();
    }
}

export default withTransaction;
