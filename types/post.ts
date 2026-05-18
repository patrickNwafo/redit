import { PostSort } from "@/lib/postSort";

export type PostFeedItem = {
    _id: string;
    title?: string | null;
    postKind?: string | null;
    linkUrl?: string | null;
    body?: Array<{
        children?: Array<{ text?: string }>;
    }> | null;
    publishedAt?: string | null;
    author?: {
        _id: string;
        username?: string;
        imageUrl?: string;
    } | null;
    subreddit?: {
        _id: string;
        title?: string;
        slug?: string | { current?: string };
    } | null;
    image?: {
        asset?: { _ref?: string };
        alt?: string;
    } | null;
    isDeleted?: boolean;
    votes?: {
        upvotes?: number;
        downvotes?: number;
        netScore?: number;
    };
    commentCount?: number;
};

export type { PostSort };
