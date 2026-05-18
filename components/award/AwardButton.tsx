"use client";

import { giveAward } from "@/actions/awardActions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Award = {
    _id: string;
    name?: string;
    icon?: string;
    color?: string;
};

function AwardButton({
    postId,
    awards,
    isSignedIn,
}: {
    postId: string;
    awards: Award[];
    isSignedIn: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    if (!isSignedIn || !awards.length) return null;

    const handleGive = (awardId: string) => {
        startTransition(async () => {
            await giveAward(postId, awardId);
            setOpen(false);
            router.refresh();
        });
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                disabled={isPending}
                className="text-xs font-medium text-gray-500 hover:text-orange-600 px-1 py-1"
            >
                🎁 Award
            </button>
            {open && (
                <>
                    <AwardBackdrop onClose={() => setOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 z-20 bg-white border rounded-md shadow-lg p-2 flex gap-1">
                        {awards.map((award) => (
                            <button
                                key={award._id}
                                type="button"
                                onClick={() => handleGive(award._id)}
                                disabled={isPending}
                                title={award.name}
                                className="w-9 h-9 rounded-md hover:bg-gray-100 text-lg flex items-center justify-center disabled:opacity-50 border"
                                style={{ borderColor: award.color }}
                            >
                                {award.icon}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function AwardBackdrop({ onClose }: { onClose: () => void }) {
    return <div className="fixed inset-0 z-10" onClick={onClose} />;
}

export default AwardButton;
