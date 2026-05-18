import FeedBanner from "@/components/feed/FeedBanner";
import PostsList from "@/components/post/PostsList";

export default function HotPage() {
    return (
        <>
            <FeedBanner
                title="Hot & Controversial"
                description="Trending posts from the last 7 days, plus the most debated"
            />
            <section className="my-8">
                <div className="mx-auto max-w-7xl px-4 space-y-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Hot</h2>
                        <PostsList
                            sort="hot"
                            emptyMessage="No hot posts this week."
                        />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">
                            Controversial
                        </h2>
                        <PostsList
                            sort="controversial"
                            emptyMessage="No controversial posts yet."
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
