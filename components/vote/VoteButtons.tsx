"use client";

import { voteContent } from "@/actions/voteContent";
import { cn } from "@/lib/utils";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type VoteButtonsProps = {
    contentId: string;
    contentType: "post" | "comment";
    votes: {
        upvotes: number;
        downvotes: number;
        netScore: number;
    };
    voteStatus: "upvote" | "downvote" | null;
    isSignedIn: boolean;
};

function VoteButtons({
    contentId,
    contentType,
    votes,
    voteStatus,
    isSignedIn,
}: VoteButtonsProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleVote = (type: "upvote" | "downvote") => {
        if (!isSignedIn) return;

        startTransition(async () => {
            const result = await voteContent(contentId, contentType, type);

            if ("error" in result && result.error) {
                console.error("Vote error:", result.error);
                return;
            }

            router.refresh();
        });
    };

    return (
        <div className="flex flex-col items-center gap-0.5 py-2 px-1 bg-gray-50/80 rounded-l-md">
            <button
                type="button"
                onClick={() => handleVote("upvote")}
                disabled={!isSignedIn || isPending}
                aria-label="Upvote"
                className={cn(
                    "p-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    voteStatus === "upvote" && "text-orange-500",
                )}
            >
                <ArrowBigUp
                    className={cn(
                        "w-5 h-5",
                        voteStatus === "upvote" && "fill-current",
                    )}
                />
            </button>
            <span
                className={cn(
                    "text-xs font-bold tabular-nums",
                    votes.netScore > 0 && "text-orange-500",
                    votes.netScore < 0 && "text-blue-500",
                )}
            >
                {votes.netScore}
            </span>
            <button
                type="button"
                onClick={() => handleVote("downvote")}
                disabled={!isSignedIn || isPending}
                aria-label="Downvote"
                className={cn(
                    "p-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    voteStatus === "downvote" && "text-blue-500",
                )}
            >
                <ArrowBigDown
                    className={cn(
                        "w-5 h-5",
                        voteStatus === "downvote" && "fill-current",
                    )}
                />
            </button>
        </div>
    );
}

export default VoteButtons;
