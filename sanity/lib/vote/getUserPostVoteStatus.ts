// Get user vote status for a post

import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getUserPostVoteStatus(
    postId: string,
    userId: string | null
) {
    const getUserVotePostVoteStatusQuery = defineQuery(
        `*[_type == "vote" && post._ref == $postId && user._ref == $userId][0].voteType`
    );

    const result = await sanityFetch({
        query: getUserVotePostVoteStatusQuery,
        params: { postId, userId: userId || "" },
    });

    // Returns "upvote", "downvote", or null if no vote
    return result.data;
}
