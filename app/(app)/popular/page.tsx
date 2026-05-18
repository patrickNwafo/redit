import FeedBanner from "@/components/feed/FeedBanner";
import PostsList from "@/components/post/PostsList";

export default function PopularPage() {
    return (
        <>
            <FeedBanner
                title="Popular"
                description="Top posts by score across all communities"
            />
            <section className="my-8">
                <div className="mx-auto max-w-7xl px-4">
                    <PostsList
                        sort="popular"
                        emptyMessage="No popular posts yet."
                    />
                </div>
            </section>
        </>
    );
}
