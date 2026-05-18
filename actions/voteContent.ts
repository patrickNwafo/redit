"use server";

import { castVote } from "@/sanity/lib/vote/castVote";
import { getUser } from "@/sanity/lib/user/getUser";
import { revalidatePath } from "next/cache";

export async function voteContent(
    contentId: string,
    contentType: "post" | "comment",
    voteType: "upvote" | "downvote",
) {
    const user = await getUser();

    if ("error" in user) {
        return { error: user.error };
    }

    try {
        const result = await castVote(
            user._id,
            contentId,
            contentType,
            voteType,
        );
        return result;
    } catch (error) {
        console.error("Failed to cast vote:", error);
        return { error: "Failed to cast vote" };
    } finally {
        revalidatePath("/", "layout");
    }
}
