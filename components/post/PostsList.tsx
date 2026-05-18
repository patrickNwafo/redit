import { PostSort } from "@/lib/postSort";
import { PostFeedItem } from "@/types/post";
import { getPosts } from "@/sanity/lib/post/getPosts";
import { currentUser } from "@clerk/nextjs/server";
import Post from "./Post";

async function PostsList({
    subredditSlug,
    sort = "new",
    emptyMessage = "No posts yet. Be the first to post!",
}: {
    subredditSlug?: string;
    sort?: PostSort;
    emptyMessage?: string;
} = {}) {
    const posts = await getPosts({ subredditSlug, sort });
    const user = await currentUser();

    if (!posts?.length) {
        return (
            <div className="py-12 text-center bg-white rounded-md border">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post: PostFeedItem) => (
                <Post key={post._id} post={post} userId={user?.id || null} />
            ))}
        </div>
    );
}

export default PostsList;
