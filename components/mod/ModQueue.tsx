"use client";

import {
    modBanFromCommunity,
    modDeleteContent,
    modDismissReport,
    modSiteBanUser,
} from "@/actions/modActions";
import { Button } from "@/components/ui/button";
import TimeAgo from "@/components/TimeAgo";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type ModQueueProps = {
    subredditSlug: string;
    posts: Array<{
        _id: string;
        title?: string | null;
        publishedAt?: string | null;
        author?: { _id?: string; username?: string } | null;
    }>;
    comments: Array<{
        _id: string;
        content?: string | null;
        createdAt?: string | null;
        author?: { _id?: string; username?: string } | null;
        post?: { _id?: string; title?: string | null } | null;
    }>;
};

function ModQueue({ subredditSlug, posts, comments }: ModQueueProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const run = (fn: () => Promise<unknown>) => {
        startTransition(async () => {
            await fn();
            router.refresh();
        });
    };

    if (!posts.length && !comments.length) {
        return (
            <p className="text-gray-500 text-center py-12 bg-white border rounded-md">
                Mod queue is empty — no reported content.
            </p>
        );
    }

    return (
        <div className="space-y-8">
            {posts.length > 0 && (
                <section className="space-y-3">
                    <h2 className="font-semibold">Reported posts</h2>
                    {posts.map((post) => (
                        <ModItem
                            key={post._id}
                            title={post.title ?? "Untitled"}
                            meta={`u/${post.author?.username}`}
                            time={
                                post.publishedAt
                                    ? new Date(post.publishedAt)
                                    : undefined
                            }
                            isPending={isPending}
                            onDismiss={() =>
                                run(() =>
                                    modDismissReport(
                                        subredditSlug,
                                        post._id,
                                        "post",
                                    ),
                                )
                            }
                            onRemove={() =>
                                run(() =>
                                    modDeleteContent(
                                        subredditSlug,
                                        post._id,
                                        "post",
                                    ),
                                )
                            }
                            onBan={
                                post.author?._id
                                    ? () =>
                                          run(() =>
                                              modBanFromCommunity(
                                                  subredditSlug,
                                                  post.author!._id!,
                                              ),
                                          )
                                    : undefined
                            }
                            onSiteBan={
                                post.author?._id
                                    ? () =>
                                          run(() =>
                                              modSiteBanUser(
                                                  subredditSlug,
                                                  post.author!._id!,
                                              ),
                                          )
                                    : undefined
                            }
                        />
                    ))}
                </section>
            )}

            {comments.length > 0 && (
                <section className="space-y-3">
                    <h2 className="font-semibold">Reported comments</h2>
                    {comments.map((comment) => (
                        <ModItem
                            key={comment._id}
                            title={comment.content ?? ""}
                            meta={`on "${comment.post?.title}" · u/${comment.author?.username}`}
                            time={
                                comment.createdAt
                                    ? new Date(comment.createdAt)
                                    : undefined
                            }
                            isPending={isPending}
                            onDismiss={() =>
                                run(() =>
                                    modDismissReport(
                                        subredditSlug,
                                        comment._id,
                                        "comment",
                                    ),
                                )
                            }
                            onRemove={() =>
                                run(() =>
                                    modDeleteContent(
                                        subredditSlug,
                                        comment._id,
                                        "comment",
                                    ),
                                )
                            }
                            onBan={
                                comment.author?._id
                                    ? () =>
                                          run(() =>
                                              modBanFromCommunity(
                                                  subredditSlug,
                                                  comment.author!._id!,
                                              ),
                                          )
                                    : undefined
                            }
                            onSiteBan={
                                comment.author?._id
                                    ? () =>
                                          run(() =>
                                              modSiteBanUser(
                                                  subredditSlug,
                                                  comment.author!._id!,
                                              ),
                                          )
                                    : undefined
                            }
                        />
                    ))}
                </section>
            )}
        </div>
    );
}

function ModItem({
    title,
    meta,
    time,
    isPending,
    onDismiss,
    onRemove,
    onBan,
    onSiteBan,
}: {
    title: string;
    meta: string;
    time?: Date;
    isPending: boolean;
    onDismiss: () => void;
    onRemove: () => void;
    onBan?: () => void;
    onSiteBan?: () => void;
}) {
    return (
        <ModItemCard
            title={title}
            meta={meta}
            time={time}
            isPending={isPending}
            onDismiss={onDismiss}
            onRemove={onRemove}
            onBan={onBan}
            onSiteBan={onSiteBan}
        />
    );
}

function ModItemCard({
    title,
    meta,
    time,
    isPending,
    onDismiss,
    onRemove,
    onBan,
    onSiteBan,
}: {
    title: string;
    meta: string;
    time?: Date;
    isPending: boolean;
    onDismiss: () => void;
    onRemove: () => void;
    onBan?: () => void;
    onSiteBan?: () => void;
}) {
    return (
        <div className="bg-white border rounded-md p-4 space-y-3">
            <p className="font-medium line-clamp-2">{title}</p>
            <p className="text-xs text-gray-500">
                {meta}
                {time && (
                    <>
                        {" "}
                        · <TimeAgo date={time} />
                    </>
                )}
            </p>
            <div className="flex flex-wrap gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onDismiss}
                    disabled={isPending}
                >
                    Dismiss
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={onRemove}
                    disabled={isPending}
                >
                    Remove
                </Button>
                {onBan && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onBan}
                        disabled={isPending}
                    >
                        Ban from community
                    </Button>
                )}
                {onSiteBan && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onSiteBan}
                        disabled={isPending}
                    >
                        Site ban
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ModQueue;
