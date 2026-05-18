function FeedBanner({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <section className="bg-white border-b">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
        </section>
    );
}

export default FeedBanner;
