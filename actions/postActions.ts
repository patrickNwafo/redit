"use server";

import { deletePost } from "@/sanity/lib/post/deletePost";
import { updatePost } from "@/sanity/lib/post/updatePost";
import { getUser } from "@/sanity/lib/user/getUser";
import { revalidatePath } from "next/cache";

export async function editPost(
    postId: string,
    title: string,
    body?: string,
    linkUrl?: string,
) {
    const user = await getUser();
    if ("error" in user) return { error: user.error };

    try {
        const result = await updatePost(postId, user._id, {
            title,
            body,
            linkUrl,
        });
        return result;
    } catch {
        return { error: "Failed to update post" };
    } finally {
        revalidatePath("/", "layout");
    }
}

export async function removePost(postId: string) {
    const user = await getUser();
    if ("error" in user) return { error: user.error };

    try {
        const result = await deletePost(postId, user._id);
        return result;
    } catch {
        return { error: "Failed to delete post" };
    } finally {
        revalidatePath("/", "layout");
    }
}
