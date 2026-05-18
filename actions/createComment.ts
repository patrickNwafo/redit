"use server";

import { addComment } from "@/sanity/lib/comment/addComment";
import { getPostSubredditId } from "@/sanity/lib/post/getPostSubredditId";
import { isUserBannedFromSubreddit } from "@/sanity/lib/user/isUserBannedFromSubreddit";
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

    const subredditId = await getPostSubredditId(postId);
    if (subredditId) {
        const banned = await isUserBannedFromSubreddit(user._id, subredditId);
        if (banned) {
            return { error: "You are banned from this community" };
        }
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
        revalidatePath("/", "layout");
    }
}
