"use server";

import { reportContent as reportContentDoc } from "@/sanity/lib/report/reportContent";
import { getUser } from "@/sanity/lib/user/getUser";
import { revalidatePath } from "next/cache";

export async function reportPost(postId: string) {
    const user = await getUser();
    if ("error" in user) return { error: user.error };

    try {
        return await reportContentDoc(postId, "post", user._id);
    } catch {
        return { error: "Failed to report post" };
    } finally {
        revalidatePath("/", "layout");
    }
}

export async function reportComment(commentId: string) {
    const user = await getUser();
    if ("error" in user) return { error: user.error };

    try {
        return await reportContentDoc(commentId, "comment", user._id);
    } catch {
        return { error: "Failed to report comment" };
    } finally {
        revalidatePath("/", "layout");
    }
}
