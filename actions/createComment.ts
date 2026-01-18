"use server";

import { addComment } from "@/sanity/lib/comment/addComment";
import { getUser } from "@/sanity/lib/user/getUser";

import { revalidatePath } from "next/cache";

export async function createComment(
    postId: string,
    parentCommentId: string | undefined,
    content: string,
) {
    const user = await getUser();

    if ("error" in user) {
        return { error: user.error };
    }

    try {
        const comment = await addComment({
            postId,
            userId: user._id,
            content,
            parentCommentId,
        });

        return { comment };
    } catch (error) {
        console.error("Failed to add comment:", error);
        return { error: "Failed to add comment" };
    } finally {
        revalidatePath("/");
    }
}
