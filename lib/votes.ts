export function normalizeVotes(votes: {
    upvotes: number;
    downvotes: number;
    netScore?: number;
    netscore?: number;
}) {
    return {
        upvotes: votes.upvotes,
        downvotes: votes.downvotes,
        netScore: votes.netScore ?? votes.netscore ?? 0,
    };
}
