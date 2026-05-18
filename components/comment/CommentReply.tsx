"use client";

import { useState } from "react";
import CommentInput from "./CommentInput";

function CommentReply({
    postId,
    parentCommentId,
}: {
    postId: string;
    parentCommentId: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-xs font-medium text-gray-500 hover:text-gray-800"
            >
                Reply
            </button>
        );
    }

    return (
        <div className="mt-2 space-y-2">
            <CommentInput
                postId={postId}
                parentCommentId={parentCommentId}
                onSuccess={() => setIsOpen(false)}
            />
            <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-800"
            >
                Cancel
            </button>
        </div>
    );
}

export default CommentReply;
