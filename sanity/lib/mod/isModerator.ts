export function isModerator(
    userId: string | null | undefined,
    subreddit: { moderator?: { _ref?: string } | null } | null,
) {
    if (!userId || !subreddit?.moderator) return false;
    const modRef =
        typeof subreddit.moderator === "object" && "_ref" in subreddit.moderator
            ? subreddit.moderator._ref
            : (subreddit.moderator as { _id?: string })._id;
    return modRef === userId;
}
