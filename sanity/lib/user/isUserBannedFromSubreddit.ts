import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function isUserBannedFromSubreddit(
    userId: string,
    subredditId: string,
) {
    const query = defineQuery(`
        count(*[_type == "subreddit" && _id == $subredditId && $userId in bannedUsers[]._ref]) > 0
    `);

    const result = await sanityFetch({
        query,
        params: { userId, subredditId },
    });

    return Boolean(result.data);
}
