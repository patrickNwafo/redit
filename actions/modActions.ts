"use server";

import {
    banUserFromSubreddit,
    dismissReport,
    modRemoveContent,
    siteBanUser,
} from "@/sanity/lib/mod/modActions";
import { isModerator } from "@/sanity/lib/mod/isModerator";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import { getUser } from "@/sanity/lib/user/getUser";
import { revalidatePath } from "next/cache";

async function requireMod(subredditSlug: string) {
    const user = await getUser();
    if ("error" in user) return { error: user.error };

    const subreddit = await getSubredditBySlug(subredditSlug);
    if (!subreddit) return { error: "Community not found" };

    if (!isModerator(user._id, { moderator: { _ref: subreddit.moderator?._id } })) {
        return { error: "You are not a moderator of this community" };
    }

    return { user, subreddit };
}

export async function modDismissReport(
    subredditSlug: string,
    contentId: string,
    contentType: "post" | "comment",
) {
    const auth = await requireMod(subredditSlug);
    if ("error" in auth) return auth;

    try {
        await dismissReport(contentId, contentType);
        return { success: true };
    } catch {
        return { error: "Failed to dismiss report" };
    } finally {
        revalidatePath("/", "layout");
    }
}

export async function modDeleteContent(
    subredditSlug: string,
    contentId: string,
    contentType: "post" | "comment",
) {
    const auth = await requireMod(subredditSlug);
    if ("error" in auth) return auth;

    try {
        await modRemoveContent(contentId, contentType);
        return { success: true };
    } catch {
        return { error: "Failed to remove content" };
    } finally {
        revalidatePath("/", "layout");
    }
}

export async function modBanFromCommunity(
    subredditSlug: string,
    targetUserId: string,
) {
    const auth = await requireMod(subredditSlug);
    if ("error" in auth) return auth;

    try {
        await banUserFromSubreddit(auth.subreddit._id, targetUserId);
        return { success: true };
    } catch {
        return { error: "Failed to ban user" };
    } finally {
        revalidatePath("/", "layout");
    }
}

export async function modSiteBanUser(
    subredditSlug: string,
    targetUserId: string,
) {
    const auth = await requireMod(subredditSlug);
    if ("error" in auth) return auth;

    try {
        await siteBanUser(targetUserId);
        return { success: true };
    } catch {
        return { error: "Failed to ban user site-wide" };
    } finally {
        revalidatePath("/", "layout");
    }
}
