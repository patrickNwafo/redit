import { currentUser } from "@clerk/nextjs/server";

async function PostsList() {
    const posts = await getPosts();
    const user = await currentUser();

    return <div>PostsList</div>;
}

export default PostsList;
