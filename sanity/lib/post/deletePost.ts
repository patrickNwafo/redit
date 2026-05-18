import { adminClient } from "../adminClient";

export async function deletePost(postId: string, userId: string) {
    const post = await adminClient.getDocument(postId);

    if (!post || post._type !== "post") {
        return { error: "Post not found" };
    }

    if (post.author?._ref !== userId) {
        return { error: "You can only delete your own posts" };
    }

    await adminClient.patch(postId).set({ isDeleted: true }).commit();
    return { success: true };
}
