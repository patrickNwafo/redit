import { ImageData } from "@/actions/createCommunity";
import { adminClient } from "../adminClient";

type PostKind = "text" | "image" | "link";

interface CreatePostParams {
    title: string;
    postKind: PostKind;
    subredditId: string;
    userId: string;
    body?: string;
    linkUrl?: string;
    imageData?: ImageData | null;
}

function textToBlocks(text: string) {
    return [
        {
            _type: "block" as const,
            style: "normal" as const,
            markDefs: [],
            children: [
                {
                    _type: "span" as const,
                    text,
                    marks: [],
                },
            ],
        },
    ];
}

export async function createPost({
    title,
    postKind,
    subredditId,
    userId,
    body,
    linkUrl,
    imageData,
}: CreatePostParams) {
    try {
        let imageAsset;

        if (imageData && postKind === "image") {
            const base64Data = imageData.base64.split(",")[1];
            const buffer = Buffer.from(base64Data, "base64");

            imageAsset = await adminClient.assets.upload("image", buffer, {
                filename: imageData.fileName,
                contentType: imageData.contentType,
            });
        }

        const post = await adminClient.create({
            _type: "post",
            title,
            originalTitle: title,
            postKind,
            author: { _type: "reference", _ref: userId },
            subreddit: { _type: "reference", _ref: subredditId },
            publishedAt: new Date().toISOString(),
            isDeleted: false,
            isReported: false,
            ...(body?.trim() ? { body: textToBlocks(body.trim()) } : {}),
            ...(postKind === "link" && linkUrl ? { linkUrl } : {}),
            ...(imageAsset
                ? {
                      image: {
                          _type: "image",
                          asset: {
                              _type: "reference",
                              _ref: imageAsset._id,
                          },
                      },
                  }
                : {}),
        });

        return { post };
    } catch (error) {
        console.error("Error creating post:", error);
        return { error: "Failed to create post" };
    }
}
