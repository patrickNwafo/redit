import { PostSort, sortPosts } from "@/lib/postSort";
import { PostFeedItem } from "@/types/post";
import { defineQuery } from "groq";
import { sanityFetch } from "../live";

const postsProjection = `{
        _id,
        title,
        postKind,
        linkUrl,
        flair,
        body,
        publishedAt,
        "author": author->,
        "subreddit": subreddit->{
            ...,
            "slug": slug.current,
            flairOptions
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
        authorUsername?: string;
        sort?: PostSort;
    } = {},
) {
    const { subredditSlug, authorUsername, sort = "new" } = options;

    let filter = `_type == "post" && isDeleted == false`;
    if (subredditSlug) {
        filter += ` && subreddit->slug.current == $subredditSlug`;
    }
    if (authorUsername) {
        filter += ` && author->username == $authorUsername`;
    }

    const getAllPostsQuery = defineQuery(
        `*[${filter}] ${postsProjection}`,
    );

    const result = await sanityFetch({
        query: getAllPostsQuery,
        params: {
            ...(subredditSlug ? { subredditSlug } : {}),
            ...(authorUsername ? { authorUsername } : {}),
        },
    });

    const posts = (result.data ?? []) as PostFeedItem[];
    return sortPosts(posts, sort);
}
