import { adminClient } from "../adminClient";

export async function deleteComment(commentId: string, userId: string) {
    const comment = await adminClient.getDocument(commentId);

    if (!comment || comment._type !== "comment") {
        return { error: "Comment not found" };
    }

    if (comment.author?._ref !== userId) {
        return { error: "You can only delete your own comments" };
    }

    await adminClient.patch(commentId).set({ isDeleted: true }).commit();
    return { success: true };
}
