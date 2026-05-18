import PostsList from "@/components/post/PostsList";
import PostFeedActions from "@/components/post/PostFeedActions";
import { urlFor } from "@/sanity/lib/image";
import { getSubredditBySlug } from "@/sanity/lib/subreddit/getSubredditBySlug";
import Image from "next/image";
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

    return (
        <>
            <section className="bg-white border-b">
                <CommunityBanner subreddit={subreddit} slug={slug} />
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
}: {
    subreddit: NonNullable<Awaited<ReturnType<typeof getSubredditBySlug>>>;
    slug: string;
}) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
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
        </div>
    );
}
