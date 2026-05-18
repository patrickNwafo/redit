import { adminClient } from "../adminClient";

export async function dismissReport(
    contentId: string,
    contentType: "post" | "comment",
) {
    await adminClient.patch(contentId).set({ isReported: false }).commit();
    return { success: true };
}

export async function modRemoveContent(
    contentId: string,
    contentType: "post" | "comment",
) {
    await adminClient
        .patch(contentId)
        .set({ isDeleted: true, isReported: false })
        .commit();
    return { success: true };
}

export async function banUserFromSubreddit(
    subredditId: string,
    userId: string,
) {
    await adminClient
        .patch(subredditId)
        .setIfMissing({ bannedUsers: [] })
        .append("bannedUsers", [{ _type: "reference", _ref: userId }])
        .commit();
    return { success: true };
}

export async function siteBanUser(userId: string) {
    await adminClient.patch(userId).set({ isBanned: true }).commit();
    return { success: true };
}
