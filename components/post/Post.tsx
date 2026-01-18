// "use client";

import { GetAllPostsQueryResult } from "@/sanity.types";
import { getPostComments } from "@/sanity/lib/vote/getPostComments";
import { getPostVotes } from "@/sanity/lib/vote/getPostVotes";
import { getUserPostVoteStatus } from "@/sanity/lib/vote/getUserPostVoteStatus";
import TimeAgo from "@/components/TimeAgo";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { MessageSquare } from "lucide-react";
import CommentInput from "../comment/CommentInput";

interface PostProps {
    post: GetAllPostsQueryResult[number];
    userId: string | null;
}

async function Post({ post, userId }: PostProps) {
    const votes = await getPostVotes(post._id);
    const vote = await getUserPostVoteStatus(post._id, userId);
    const comments = await getPostComments(post._id, userId);
    return (
        <article
            key={post._id}
            className="relative bg-white rounded-md shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
        >
            <div className="flex ">
                {/* Vote Buttons */}
                {/* <PostVoteButtons
                    contentId={post._id}
                    votes={votes}
                    vote={vote}
                    contentType="post"
                /> */}

                {/* Post Content */}
                <div className="flex-1 p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        {post.subreddit && (
                            <>
                                <a
                                    href={`/community/${post.subreddit.slug}`}
                                    className="font-medium hover:underline"
                                >
                                    c/{post.subreddit.title}
                                </a>
                                <span>•</span>
                                <span>Posted by u/{post.author?.username}</span>
                                <span>•</span>
                                {post.publishedAt && (
                                    <TimeAgo
                                        date={new Date(post.publishedAt)}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {post.subreddit && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-2">
                                {post.title}
                            </h2>
                        </div>
                    )}

                    {post.body && post.body[0]?.children?.[0]?.text && (
                        <div className="prose prose-sm max-w-none text-gray-700 mb-3">
                            {post.body[0].children[0].text}
                        </div>
                    )}

                    {post.image && post.image.asset?._ref && (
                        <div className="relative w-full h-64 mb-3 px-2 bg-gray-100/30">
                            <Image
                                src={urlFor(post.image).url()}
                                alt={post.image.alt || "post image"}
                                fill
                                className="object-contain rounded-md p-2"
                            />
                        </div>
                    )}

                    <button className="flex items-center px-1 py-2 gap-1 text-sm text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{comments.length} Comments</span>
                    </button>

                    {/* CommentInput */}
                    <CommentInput postId={post._id} />
                    {/* CommentList */}
                </div>
            </div>

            {/* Buttons */}
            {/* Report Button */}
            {/* Delete Button */}
        </article>
    );
}

export default Post;
