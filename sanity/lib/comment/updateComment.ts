import { adminClient } from "../adminClient";

export async function updateComment(
    commentId: string,
    userId: string,
    content: string,
) {
    const comment = await adminClient.getDocument(commentId);

    if (!comment || comment._type !== "comment") {
        return { error: "Comment not found" };
    }

    if (comment.author?._ref !== userId) {
        return { error: "You can only edit your own comments" };
    }

    if (comment.isDeleted) {
        return { error: "Cannot edit a deleted comment" };
    }

    await adminClient.patch(commentId).set({ content: content.trim() }).commit();
    return { success: true };
}
