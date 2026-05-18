"use client";

import { reportComment, reportPost } from "@/actions/reportContent";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Flag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ContentActionsMenuProps = {
    contentType: "post" | "comment";
    contentId: string;
    isOwner: boolean;
    isSignedIn: boolean;
    onEdit?: () => void;
    onDelete?: () => Promise<{ error?: string }>;
};

function ContentActionsMenu({
    contentType,
    contentId,
    isOwner,
    isSignedIn,
    onEdit,
    onDelete,
}: ContentActionsMenuProps) {
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    if (!isSignedIn) return null;

    const handleReport = () => {
        setMenuOpen(false);
        startTransition(async () => {
            const result =
                contentType === "post"
                    ? await reportPost(contentId)
                    : await reportComment(contentId);

            if ("error" in result && result.error) {
                setError(result.error);
                setOpen(true);
            } else {
                setOpen(true);
                setError(null);
            }
        });
    };

    const handleDelete = () => {
        if (!onDelete) return;

        startTransition(async () => {
            const result = await onDelete();
            if ("error" in result && result.error) {
                setError(result.error);
            } else {
                setConfirmDelete(false);
                setMenuOpen(false);
                router.refresh();
            }
        });
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                aria-label="More actions"
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 bg-white border rounded-md shadow-lg py-1 min-w-[140px]">
                        {isOwner && onEdit && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEdit();
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
                            </button>
                        )}
                        {isOwner && onDelete && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    setConfirmDelete(true);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        )}
                        {!isOwner && (
                            <button
                                type="button"
                                onClick={handleReport}
                                disabled={isPending}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                <Flag className="w-3.5 h-3.5" />
                                Report
                            </button>
                        )}
                    </div>
                </>
            )}

            <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {contentType}?</DialogTitle>
                        <DialogDescription>
                            This cannot be undone. Your {contentType} will be
                            removed.
                        </DialogDescription>
                    </DialogHeader>
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDelete(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {error ? "Could not report" : "Report submitted"}
                        </DialogTitle>
                        <DialogDescription>
                            {error ??
                                "Thanks for helping keep the community safe. Moderators will review this."}
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setOpen(false)}>OK</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ContentActionsMenu;
