export type PostSort = "new" | "popular" | "hot" | "controversial";

export type PostWithScores = {
    publishedAt?: string | null;
    votes?: {
        upvotes?: number;
        downvotes?: number;
        netScore?: number;
    } | null;
    commentCount?: number;
};

function getAgeHours(publishedAt?: string | null) {
    if (!publishedAt) return 24;
    return Math.max(
        (Date.now() - new Date(publishedAt).getTime()) / 3_600_000,
        0.1,
    );
}

function hotScore(post: PostWithScores) {
    const netScore = post.votes?.netScore ?? 0;
    const comments = post.commentCount ?? 0;
    const ageHours = getAgeHours(post.publishedAt);
    return (netScore + comments * 0.5) / Math.pow(ageHours + 2, 1.2);
}

function controversialScore(post: PostWithScores) {
    const up = post.votes?.upvotes ?? 0;
    const down = post.votes?.downvotes ?? 0;
    if (up === 0 || down === 0) return 0;
    return Math.min(up, down) * (up + down);
}

export function sortPosts<T extends PostWithScores>(posts: T[], sort: PostSort): T[] {
    const copy = [...posts];

    switch (sort) {
        case "popular":
            return copy.sort(
                (a, b) => (b.votes?.netScore ?? 0) - (a.votes?.netScore ?? 0),
            );
        case "hot":
            return copy
                .filter((p) => getAgeHours(p.publishedAt) <= 24 * 7)
                .sort((a, b) => hotScore(b) - hotScore(a));
        case "controversial":
            return copy.sort(
                (a, b) => controversialScore(b) - controversialScore(a),
            );
        case "new":
        default:
            return copy.sort(
                (a, b) =>
                    new Date(b.publishedAt ?? 0).getTime() -
                    new Date(a.publishedAt ?? 0).getTime(),
            );
    }
}
