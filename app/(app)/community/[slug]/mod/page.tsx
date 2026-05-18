import ModQueue from "@/components/mod/ModQueue";
import { getModQueue } from "@/sanity/lib/mod/getModQueue";
import { isModerator } from "@/sanity/lib/mod/isModerator";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import { getUser } from "@/sanity/lib/user/getUser";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ModPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const subreddit = await getSubredditBySlug(slug);

    if (!subreddit) {
        notFound();
    }

    const user = await getUser();
    if ("error" in user) {
        redirect(`/community/${slug}`);
    }

    if (!isModerator(user._id, { moderator: { _ref: subreddit.moderator?._id } })) {
        redirect(`/community/${slug}`);
    }

    const queue = await getModQueue(slug);

    return (
        <>
            <section className="bg-white border-b">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <Link
                        href={`/community/${slug}`}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        ← Back to c/{subreddit.title}
                    </Link>
                    <h1 className="text-2xl font-bold mt-2">Mod Queue</h1>
                    <p className="text-sm text-gray-600">
                        Review reported content for c/{subreddit.title}
                    </p>
                </div>
            </section>

            <section className="my-8">
                <div className="mx-auto max-w-7xl px-4">
                    <ModQueue
                        subredditSlug={slug}
                        posts={queue.posts ?? []}
                        comments={queue.comments ?? []}
                    />
                </div>
            </section>
        </>
    );
}
