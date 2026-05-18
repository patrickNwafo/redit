import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getSubredditBySlug(slug: string) {
    const query = defineQuery(`
        *[_type == "subreddit" && slug.current == $slug][0] {
            ...,
            "slug": slug.current,
            "moderator": moderator->{ _id, username },
            flairOptions,
            "bannedUserIds": bannedUsers[]._ref
        }
    `);

    const result = await sanityFetch({
        query,
        params: { slug },
    });

    return result.data;
}
