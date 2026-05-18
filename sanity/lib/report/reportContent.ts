import { adminClient } from "../adminClient";

type ReportableType = "post" | "comment" | "user";

export async function reportContent(
    contentId: string,
    contentType: ReportableType,
    reporterId: string,
) {
    const doc = await adminClient.getDocument(contentId);

    if (!doc || doc._type !== contentType) {
        return { error: "Content not found" };
    }

    if (contentType !== "user" && doc.author?._ref === reporterId) {
        return { error: "You cannot report your own content" };
    }

    if (doc.isReported) {
        return { error: "This has already been reported" };
    }

    await adminClient.patch(contentId).set({ isReported: true }).commit();
    return { success: true };
}
