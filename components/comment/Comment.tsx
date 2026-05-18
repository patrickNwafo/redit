import TimeAgo from "@/components/TimeAgo";
import VoteButtons from "@/components/vote/VoteButtons";
import { normalizeVotes } from "@/lib/votes";
import {
    GetCommentRepliesQueryResult,
    GetPostCommentsQueryResult,
} from "@/sanity.types";
import { getCommentReplies } from "@/sanity/lib/comment/getCommentReplies";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentMenu from "./CommentMenu";
import CommentList from "./CommentList";
import CommentReply from "./CommentReply";

async function Comment({
    postId,
    comment,
    userId,
}: {
    postId: string;
    comment:
        | GetPostCommentsQueryResult[number]
        | GetCommentRepliesQueryResult[number];
    userId: string | null;
}) {
    const replies = await getCommentReplies(comment._id, userId);

    return (
        <article className="py-5 border-b border-gray-100 last:border-0">
            <div className="flex gap-2">
                <VoteButtons
                    contentId={comment._id}
                    contentType="comment"
                    votes={normalizeVotes(comment.votes)}
                    voteStatus={comment.votes.voteStatus ?? null}
                    isSignedIn={!!userId}
                />

                <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                        {comment.author?.imageUrl ? (
                            <Image
                                src={comment.author.imageUrl}
                                alt={`${comment.author.username}'s profile picture`}
                                width={32}
                                height={32}
                                className="rounded-full w-8 h-8 object-cover shrink-0"
                            />
                        ) : (
                            <UserCircle className="w-8 h-8 text-gray-300 shrink-0" />
                        )}

                        {comment.author?.username ? (
                            <Link
                                href={`/user/${comment.author.username}`}
                                className="font-medium text-gray-900 text-sm hover:underline"
                            >
                                {comment.author.username}
                            </Link>
                        ) : (
                            <h3 className="font-medium text-gray-900 text-sm">
                                Anonymous
                            </h3>
                        )}
                        <span className="text-xs text-gray-500">
                            <TimeAgo date={new Date(comment.createdAt!)} />
                        </span>
                        </div>
                        <CommentMenu
                            commentId={comment._id}
                            authorId={comment.author?._id}
                            userId={userId}
                            content={comment.content ?? ""}
                        />
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm">
                        {comment.content}
                    </p>

                    <CommentReply postId={postId} parentCommentId={comment._id} />

                    {replies?.length > 0 && (
                        <div className="mt-3 ps-2 border-s-2 border-gray-100">
                            <CommentList
                                postId={postId}
                                comments={replies}
                                userId={userId}
                                isNested
                            />
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

export default Comment;
