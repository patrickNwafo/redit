import { sanityFetch } from "../live";
import { defineQuery } from "groq";

const postsProjection = `{
        _id,
        title,
        postKind,
        linkUrl,
        body,
        publishedAt,
        "author": author->,
        "subreddit": subreddit->{
            ...,
            "slug": slug.current
        },
        image,
        isDeleted
    }`;

export async function getPosts(subredditSlug?: string) {
    const getAllPostsQuery = subredditSlug
        ? defineQuery(
              `*[_type == "post" && isDeleted == false && subreddit->slug.current == $subredditSlug] ${postsProjection} | order(publishedAt desc)`,
          )
        : defineQuery(
              `*[_type == "post" && isDeleted == false] ${postsProjection} | order(publishedAt desc)`,
          );

    const posts = await sanityFetch({
        query: getAllPostsQuery,
        params: subredditSlug ? { subredditSlug } : {},
    });
    return posts.data;
}
