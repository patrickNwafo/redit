import { GetAllPostsQueryResult } from "@/sanity.types";
import { getPostComments } from "@/sanity/lib/vote/getPostComments";
import { getPostVotes } from "@/sanity/lib/vote/getPostVotes";
import { getUserPostVoteStatus } from "@/sanity/lib/vote/getUserPostVoteStatus";

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
                                <span>.</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            {/* Report Button */}
            {/* Delete Button */}
        </article>
    );
}

export default Post;
