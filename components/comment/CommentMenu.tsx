"use client";

import { editComment, removeComment } from "@/actions/commentActions";
import ContentActionsMenu from "@/components/shared/ContentActionsMenu";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

function CommentMenu({
    commentId,
    authorId,
    userId,
    content,
}: {
    commentId: string;
    authorId?: string;
    userId: string | null;
    content: string;
}) {
    const [editOpen, setEditOpen] = useState(false);
    const [editContent, setEditContent] = useState(content);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const isOwner = !!userId && authorId === userId;

    useEffect(() => {
        if (editOpen) {
            setEditContent(content);
            setError(null);
        }
    }, [editOpen, content]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await editComment(commentId, editContent);
            if ("error" in result && result.error) {
                setError(result.error);
                return;
            }
            setEditOpen(false);
            router.refresh();
        });
    };

    return (
        <>
            <ContentActionsMenu
                contentType="comment"
                contentId={commentId}
                isOwner={isOwner}
                isSignedIn={!!userId}
                onEdit={isOwner ? () => setEditOpen(true) : undefined}
                onDelete={
                    isOwner ? () => removeComment(commentId) : undefined
                }
            />
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit comment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            required
                        />
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full"
                        >
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CommentMenu;
