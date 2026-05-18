"use server";

import { grantAward } from "@/sanity/lib/award/getAwards";
import { getUser } from "@/sanity/lib/user/getUser";
import { revalidatePath } from "next/cache";

export async function giveAward(postId: string, awardId: string) {
    const user = await getUser();
    if ("error" in user) return { error: user.error };

    try {
        await grantAward(awardId, user._id, postId);
        return { success: true };
    } catch {
        return { error: "Failed to give award" };
    } finally {
        revalidatePath("/", "layout");
    }
}
