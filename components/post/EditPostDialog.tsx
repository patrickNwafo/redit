"use client";

import { editPost } from "@/actions/postActions";
import { getPostBodyText } from "@/lib/post";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type BodyBlocks = Parameters<typeof getPostBodyText>[0];

function EditPostDialog({
    postId,
    title: initialTitle,
    body,
    linkUrl: initialLinkUrl,
    postKind,
    open,
    onOpenChange,
}: {
    postId: string;
    title: string;
    body?: BodyBlocks;
    linkUrl?: string | null;
    postKind?: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [title, setTitle] = useState(initialTitle);
    const [bodyText, setBodyText] = useState(getPostBodyText(body) ?? "");
    const [linkUrl, setLinkUrl] = useState(initialLinkUrl ?? "");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        if (open) {
            setTitle(initialTitle);
            setBodyText(getPostBodyText(body) ?? "");
            setLinkUrl(initialLinkUrl ?? "");
            setError(null);
        }
    }, [open, initialTitle, body, initialLinkUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const result = await editPost(
                postId,
                title,
                bodyText,
                postKind === "link" ? linkUrl : undefined,
            );

            if ("error" in result && result.error) {
                setError(result.error);
                return;
            }

            onOpenChange(false);
            router.refresh();
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="space-y-2">
                        <label htmlFor="edit-title" className="text-sm font-medium">
                            Title
                        </label>
                        <Input
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={200}
                        />
                    </div>
                    {postKind === "link" && (
                        <div className="space-y-2">
                            <label htmlFor="edit-link" className="text-sm font-medium">
                                URL
                            </label>
                            <Input
                                id="edit-link"
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="edit-body" className="text-sm font-medium">
                            Body
                        </label>
                        <Textarea
                            id="edit-body"
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? "Saving..." : "Save changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditPostDialog;
