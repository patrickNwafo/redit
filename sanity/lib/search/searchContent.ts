import { PostFeedItem } from "@/types/post";
import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export type SearchSubredditResult = {
    _id: string;
    title?: string | null;
    description?: string | null;
    slug?: string | null;
    image?: {
        asset?: { _ref?: string };
        _type?: string;
    } | null;
};

export type SearchResults = {
    posts: PostFeedItem[];
    subreddits: SearchSubredditResult[];
};

export async function searchContent(query: string): Promise<SearchResults> {
    const trimmed = query.trim();
    if (!trimmed) {
        return { posts: [], subreddits: [] };
    }

    const searchQuery = defineQuery(`{
        "posts": *[_type == "post" && isDeleted == false && (
            title match $pattern ||
            pt::text(body) match $pattern
        )] {
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
            "votes": {
                "upvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]),
                "downvotes": count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"]),
                "netScore": count(*[_type == "vote" && post._ref == ^._id && voteType == "upvote"]) - count(*[_type == "vote" && post._ref == ^._id && voteType == "downvote"])
            }
        } | order(publishedAt desc)[0...20],
        "subreddits": *[_type == "subreddit" && (
            title match $pattern ||
            description match $pattern
        )] {
            _id,
            title,
            description,
            "slug": slug.current,
            image
        }[0...10]
    }`);

    const result = await sanityFetch({
        query: searchQuery,
        params: { pattern: `*${trimmed}*` },
    });

    const data = result.data as SearchResults | null;
    return data ?? { posts: [], subreddits: [] };
}
