import { adminClient } from "../adminClient";

function textToBlocks(text: string) {
    return [
        {
            _type: "block" as const,
            style: "normal" as const,
            markDefs: [],
            children: [{ _type: "span" as const, text, marks: [] }],
        },
    ];
}

export async function updatePost(
    postId: string,
    userId: string,
    data: { title: string; body?: string; linkUrl?: string },
) {
    const post = await adminClient.getDocument(postId);

    if (!post || post._type !== "post") {
        return { error: "Post not found" };
    }

    if (post.author?._ref !== userId) {
        return { error: "You can only edit your own posts" };
    }

    if (post.isDeleted) {
        return { error: "Cannot edit a deleted post" };
    }

    const patch = adminClient.patch(postId).set({ title: data.title });

    if (data.body !== undefined) {
        patch.set({
            body: data.body.trim() ? textToBlocks(data.body.trim()) : [],
        });
    }

    if (data.linkUrl !== undefined && post.postKind === "link") {
        patch.set({ linkUrl: data.linkUrl });
    }

    await patch.commit();
    return { success: true };
}
