import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getModQueue(subredditSlug: string) {
    const query = defineQuery(`{
        "posts": *[_type == "post" && isReported == true && isDeleted != true && subreddit->slug.current == $slug] {
            _id,
            title,
            publishedAt,
            "author": author->,
            isReported
        } | order(publishedAt desc),
        "comments": *[_type == "comment" && isReported == true && isDeleted != true && post->subreddit->slug.current == $slug] {
            _id,
            content,
            createdAt,
            "author": author->,
            "post": post->{ _id, title },
            isReported
        } | order(createdAt desc)
    }`);

    const result = await sanityFetch({
        query,
        params: { slug: subredditSlug },
    });

    return (
        result.data ?? {
            posts: [],
            comments: [],
        }
    );
}
