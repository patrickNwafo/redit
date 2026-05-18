import { GetAllPostsQueryResult } from "@/sanity.types";
import { getPosts } from "@/sanity/lib/post/getPosts";
import { currentUser } from "@clerk/nextjs/server";
import Post from "./Post";

async function PostsList({ subredditSlug }: { subredditSlug?: string } = {}) {
    const posts = await getPosts(subredditSlug);
    const user = await currentUser();

    if (!posts?.length) {
        return (
            <div className="py-12 text-center bg-white rounded-md border">
                <p className="text-gray-500">
                    No posts yet. Be the first to post!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post: GetAllPostsQueryResult[number]) => (
                <Post key={post._id} post={post} userId={user?.id || null} />
            ))}
        </div>
    );
}

export default PostsList;
