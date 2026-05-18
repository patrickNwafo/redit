"use client";

import { removePost } from "@/actions/postActions";
import ContentActionsMenu from "@/components/shared/ContentActionsMenu";
import { getPostBodyText } from "@/lib/post";
import { useState } from "react";
import EditPostDialog from "./EditPostDialog";

type BodyBlocks = Parameters<typeof getPostBodyText>[0];

function PostMenu({
    postId,
    authorId,
    userId,
    title,
    linkUrl,
    postKind,
    body,
}: {
    postId: string;
    authorId?: string;
    userId: string | null;
    title: string;
    linkUrl?: string | null;
    postKind?: string | null;
    body?: BodyBlocks;
}) {
    const [editOpen, setEditOpen] = useState(false);
    const isOwner = !!userId && authorId === userId;

    return (
        <>
            <ContentActionsMenu
                contentType="post"
                contentId={postId}
                isOwner={isOwner}
                isSignedIn={!!userId}
                onEdit={isOwner ? () => setEditOpen(true) : undefined}
                onDelete={isOwner ? () => removePost(postId) : undefined}
            />
            {isOwner && (
                <EditPostDialog
                    postId={postId}
                    title={title}
                    body={body}
                    linkUrl={linkUrl}
                    postKind={postKind}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                />
            )}
        </>
    );
}

export default PostMenu;
