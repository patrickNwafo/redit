import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getUserKarma(userId: string) {
    const query = defineQuery(`{
        "postKarma": (
            count(*[_type == "vote" && voteType == "upvote" && post->author._ref == $userId]) -
            count(*[_type == "vote" && voteType == "downvote" && post->author._ref == $userId])
        ),
        "commentKarma": (
            count(*[_type == "vote" && voteType == "upvote" && comment->author._ref == $userId]) -
            count(*[_type == "vote" && voteType == "downvote" && comment->author._ref == $userId])
        )
    }`);

    const result = await sanityFetch({
        query,
        params: { userId },
    });

    const data = result.data as {
        postKarma: number;
        commentKarma: number;
    } | null;

    const postKarma = data?.postKarma ?? 0;
    const commentKarma = data?.commentKarma ?? 0;

    return {
        postKarma,
        commentKarma,
        totalKarma: postKarma + commentKarma,
    };
}
