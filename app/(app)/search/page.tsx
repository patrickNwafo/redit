import FeedBanner from "@/components/feed/FeedBanner";
import Post from "@/components/post/Post";
import { PostFeedItem } from "@/types/post";
import { urlFor } from "@/sanity/lib/image";
import { searchContent } from "@/sanity/lib/search/searchContent";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const { query } = await searchParams;
    const user = await currentUser();
    const userId = user?.id ?? null;

    if (!query?.trim()) {
        return (
            <>
                <FeedBanner
                    title="Search"
                    description="Find posts and communities"
                />
                <section className="my-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <p className="text-gray-500 text-center py-12">
                            Enter a search term in the sidebar to get started.
                        </p>
                    </div>
                </section>
            </>
        );
    }

    const results = await searchContent(query);

    return (
        <>
            <FeedBanner
                title={`Search: "${query}"`}
                description={`${results.posts?.length ?? 0} posts · ${results.subreddits?.length ?? 0} communities`}
            />
            <section className="my-8">
                <div className="mx-auto max-w-7xl px-4 space-y-8">
                    {results.subreddits?.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Communities
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {results.subreddits.map((sub) => (
                                        <Link
                                            key={sub._id}
                                            href={`/community/${sub.slug}`}
                                            className="flex items-center gap-3 p-4 bg-white border rounded-md hover:border-gray-300 transition-colors"
                                        >
                                            {sub.image &&
                                                typeof sub.image === "object" &&
                                                "asset" in sub.image &&
                                                sub.image.asset?._ref && (
                                                <SubredditThumb
                                                    image={sub.image}
                                                    title={sub.title}
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-medium">
                                                    c/{sub.title}
                                                </p>
                                                {sub.description && (
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {sub.description}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ),
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Posts</h2>
                        {results.posts?.length > 0 ? (
                            <div className="space-y-4">
                                {results.posts.map(
                                    (post: PostFeedItem) => (
                                        <Post
                                            key={post._id}
                                            post={post}
                                            userId={userId}
                                        />
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8 bg-white border rounded-md">
                                No posts found for &ldquo;{query}&rdquo;
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

function SubredditThumb({
    image,
    title,
}: {
    image: { asset?: { _ref?: string } };
    title?: string | null;
}) {
    return (
        <div className="relative w-10 h-10 shrink-0">
            <Image
                src={urlFor(image).url()}
                alt={title || "community"}
                fill
                className="rounded-full object-cover"
            />
        </div>
    );
}
