import CommentInput from "@/components/comment/CommentInput";
import CommentList from "@/components/comment/CommentList";
import PostMenu from "@/components/post/PostMenu";
import TimeAgo from "@/components/TimeAgo";
import VoteButtons from "@/components/vote/VoteButtons";
import { getPostBodyText } from "@/lib/post";
import { PostFeedItem } from "@/types/post";
import { urlFor } from "@/sanity/lib/image";
import { getPostComments } from "@/sanity/lib/vote/getPostComments";
import { getPostVotes } from "@/sanity/lib/vote/getPostVotes";
import { getUserPostVoteStatus } from "@/sanity/lib/vote/getUserPostVoteStatus";
import { ExternalLink, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostProps {
    post: PostFeedItem;
    userId: string | null;
}

async function Post({ post, userId }: PostProps) {
    const votesData = await getPostVotes(post._id);
    const voteStatus = await getUserPostVoteStatus(post._id, userId);
    const comments = await getPostComments(post._id, userId);

    const votes = {
        upvotes: votesData?.upvotes ?? 0,
        downvotes: votesData?.downvotes ?? 0,
        netScore: votesData?.netScore ?? 0,
    };

    const bodyText = getPostBodyText(post.body);
    const subredditSlug =
        typeof post.subreddit?.slug === "string"
            ? post.subreddit.slug
            : post.subreddit?.slug?.current;

    return (
        <article className="relative bg-white rounded-md shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex">
                <VoteButtons
                    contentId={post._id}
                    contentType="post"
                    votes={votes}
                    voteStatus={voteStatus ?? null}
                    isSignedIn={!!userId}
                />

                <div className="flex-1 p-3 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap min-w-0">
                            {post.subreddit && subredditSlug && (
                                <>
                                    <Link
                                        href={`/community/${subredditSlug}`}
                                        className="font-medium hover:underline"
                                    >
                                        c/{post.subreddit.title}
                                    </Link>
                                    <span>•</span>
                                </>
                            )}
                            <span>Posted by u/{post.author?.username}</span>
                            <span>•</span>
                            {post.publishedAt && (
                                <TimeAgo date={new Date(post.publishedAt)} />
                            )}
                        </div>
                        <PostMenu
                            postId={post._id}
                            authorId={post.author?._id}
                            userId={userId}
                            title={post.title ?? ""}
                            body={post.body}
                            linkUrl={post.linkUrl}
                            postKind={post.postKind}
                        />
                    </div>

                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                        {post.title}
                    </h2>

                    {post.postKind === "link" && post.linkUrl && (
                        <a
                            href={post.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-3 break-all"
                        >
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            {post.linkUrl}
                        </a>
                    )}

                    {bodyText && (
                        <div className="prose prose-sm max-w-none text-gray-700 mb-3 whitespace-pre-wrap">
                            {bodyText}
                        </div>
                    )}

                    {post.image && post.image.asset?._ref && (
                        <div className="relative w-full h-64 mb-3 px-2 bg-gray-100/30">
                            <Image
                                src={urlFor(post.image).url()}
                                alt={post.image.alt || post.title || "post image"}
                                fill
                                className="object-contain rounded-md p-2"
                            />
                        </div>
                    )}

                    <button
                        type="button"
                        className="flex items-center px-1 py-2 gap-1 text-sm text-gray-500"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>{comments.length} Comments</span>
                    </button>

                    <CommentInput postId={post._id} />

                    <CommentList
                        postId={post._id}
                        comments={comments}
                        userId={userId}
                    />
                </div>
            </div>
        </article>
    );
}

export default Post;
