"use server";

import { ImageData } from "@/actions/createCommunity";
import { createPost as createPostDoc } from "@/sanity/lib/post/createPost";
import { getUser } from "@/sanity/lib/user/getUser";
import { revalidatePath } from "next/cache";

export async function createPost(
    title: string,
    postKind: "text" | "image" | "link",
    subredditId: string,
    body?: string,
    linkUrl?: string,
    imageBase64?: string | null,
    imageFileName?: string | null,
    imageContentType?: string | null,
) {
    const user = await getUser();

    if ("error" in user) {
        return { error: user.error };
    }

    if (!title.trim()) {
        return { error: "Title is required" };
    }

    if (postKind === "link" && !linkUrl?.trim()) {
        return { error: "Link URL is required for link posts" };
    }

    let imageData: ImageData = null;
    if (imageBase64 && imageFileName && imageContentType) {
        imageData = {
            base64: imageBase64,
            fileName: imageFileName,
            contentType: imageContentType,
        };
    }

    try {
        const result = await createPostDoc({
            title: title.trim(),
            postKind,
            subredditId,
            userId: user._id,
            body,
            linkUrl: linkUrl?.trim(),
            imageData: postKind === "image" ? imageData : null,
        });

        if ("error" in result && result.error) {
            return { error: result.error };
        }

        return result;
    } catch (error) {
        console.error("Failed to create post:", error);
        return { error: "Failed to create post" };
    } finally {
        revalidatePath("/", "layout");
    }
}
