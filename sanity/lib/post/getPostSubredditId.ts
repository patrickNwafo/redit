import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getPostSubredditId(postId: string) {
    const query = defineQuery(
        `*[_type == "post" && _id == $postId][0].subreddit._ref`,
    );
    const result = await sanityFetch({ query, params: { postId } });
    return result.data as string | null;
}
