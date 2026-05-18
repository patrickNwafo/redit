import { defineQuery } from "groq";
import { adminClient } from "../adminClient";
import { sanityFetch } from "../live";

type VoteType = "upvote" | "downvote";
type ContentType = "post" | "comment";

export async function castVote(
    userId: string,
    contentId: string,
    contentType: ContentType,
    voteType: VoteType,
) {
    const existingVoteQuery = defineQuery(`
        *[_type == "vote" && user._ref == $userId && (
            ($contentType == "post" && post._ref == $contentId) ||
            ($contentType == "comment" && comment._ref == $contentId)
        )][0] {
            _id,
            voteType
        }
    `);

    const existingVote = await sanityFetch({
        query: existingVoteQuery,
        params: { userId, contentId, contentType },
    });

    const existing = existingVote.data as
        | { _id: string; voteType: VoteType }
        | null
        | undefined;

    if (existing?._id) {
        if (existing.voteType === voteType) {
            await adminClient.delete(existing._id);
            return { voteStatus: null };
        }

        await adminClient
            .patch(existing._id)
            .set({ voteType })
            .commit();

        return { voteStatus: voteType };
    }

    const baseVote = {
        _type: "vote" as const,
        user: { _type: "reference" as const, _ref: userId },
        voteType,
        createdAt: new Date().toISOString(),
    };

    if (contentType === "post") {
        await adminClient.create({
            ...baseVote,
            post: { _type: "reference", _ref: contentId },
        });
    } else {
        await adminClient.create({
            ...baseVote,
            comment: { _type: "reference", _ref: contentId },
        });
    }
    return { voteStatus: voteType };
}
