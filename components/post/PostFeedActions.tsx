import { getSubreddits } from "@/sanity/lib/subreddit/getSubreddits";
import CreatePostButton from "./CreatePostButton";

async function PostFeedActions({
    defaultSubredditId,
}: {
    defaultSubredditId?: string;
}) {
    const subreddits = await getSubreddits();

    if (!subreddits?.length) {
        return (
            <p className="text-sm text-gray-500">
                Create a community before posting.
            </p>
        );
    }

    return (
        <CreatePostButton
            subreddits={subreddits.map((s) => ({
                _id: s._id,
                title: s.title,
            }))}
            defaultSubredditId={defaultSubredditId}
        />
    );
}

export default PostFeedActions;
