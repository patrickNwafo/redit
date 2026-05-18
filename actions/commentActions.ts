"use server";

import { deleteComment } from "@/sanity/lib/comment/deleteComment";
import { updateComment } from "@/sanity/lib/comment/updateComment";
import { getUser } from "@/sanity/lib/user/getUser";
import { revalidatePath } from "next/cache";

export async function editComment(commentId: string, content: string) {
    const user = await getUser();
    if ("error" in user) return { error: user.error };

    if (!content.trim()) {
        return { error: "Comment cannot be empty" };
    }

    try {
        const result = await updateComment(commentId, user._id, content);
        return result;
    } catch {
        return { error: "Failed to update comment" };
    } finally {
        revalidatePath("/", "layout");
    }
}

export async function removeComment(commentId: string) {
    const user = await getUser();
    if ("error" in user) return { error: user.error };

    try {
        const result = await deleteComment(commentId, user._id);
        return result;
    } catch {
        return { error: "Failed to delete comment" };
    } finally {
        revalidatePath("/", "layout");
    }
}
