import { PostSort, sortPosts } from "@/lib/postSort";
import { PostFeedItem } from "@/types/post";
import { defineQuery } from "groq";
import { sanityFetch } from "../live";

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
        isDeleted,
        "votes": {
            "upvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]),
            "downvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
            "netScore": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"])
        },
        "commentCount": count(*[_type == "comment" && post._ref == ^._id && isDeleted != true])
    }`;

export async function getPosts(
    options: {
        subredditSlug?: string;
        sort?: PostSort;
    } = {},
) {
    const { subredditSlug, sort = "new" } = options;

    const filter = subredditSlug
        ? `_type == "post" && isDeleted == false && subreddit->slug.current == $subredditSlug`
        : `_type == "post" && isDeleted == false`;

    const getAllPostsQuery = defineQuery(
        `*[${filter}] ${postsProjection}`,
    );

    const result = await sanityFetch({
        query: getAllPostsQuery,
        params: subredditSlug ? { subredditSlug } : {},
    });

    const posts = (result.data ?? []) as PostFeedItem[];
    return sortPosts(posts, sort);
}
