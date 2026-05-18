import PostsList from "@/components/post/PostsList";
import PostFeedActions from "@/components/post/PostFeedActions";
import { isModerator } from "@/sanity/lib/mod/isModerator";
import { urlFor } from "@/sanity/lib/image";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import { getUser } from "@/sanity/lib/user/getUser";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CommunityPage({
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
    const userId = "error" in user ? null : user._id;
    const showModLink = isModerator(userId, {
        moderator: { _ref: subreddit.moderator?._id },
    });

    return (
        <>
            <section className="bg-white border-b">
                <CommunityBanner
                    subreddit={subreddit}
                    slug={slug}
                    showModLink={showModLink}
                />
            </section>

            <section className="my-8">
                <div className="mx-auto max-w-7xl px-4 space-y-4">
                    <PostFeedActions defaultSubredditId={subreddit._id} />
                    <PostsList subredditSlug={slug} />
                </div>
            </section>
        </>
    );
}

function CommunityBanner({
    subreddit,
    slug,
    showModLink,
}: {
    subreddit: NonNullable<Awaited<ReturnType<typeof getSubredditBySlug>>>;
    slug: string;
    showModLink: boolean;
}) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                {subreddit.image?.asset?._ref && (
                    <div className="relative w-16 h-16 shrink-0">
                        <Image
                            src={urlFor(subreddit.image).url()}
                            alt={subreddit.title || slug}
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold">c/{subreddit.title}</h1>
                    {subreddit.description && (
                        <p className="text-sm text-gray-600 mt-1">
                            {subreddit.description}
                        </p>
                    )}
                </div>
            </div>
            {showModLink && (
                <Link
                    href={`/community/${slug}/mod`}
                    className="text-sm font-medium text-orange-600 hover:underline shrink-0"
                >
                    Mod queue
                </Link>
            )}
            </div>
        </div>
    );
}
