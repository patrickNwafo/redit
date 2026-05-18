import { defineQuery } from "groq";
import { adminClient } from "../adminClient";
import { sanityFetch } from "../live";

const DEFAULT_AWARDS = [
    { name: "Gold", icon: "🥇", color: "#fbbf24" },
    { name: "Silver", icon: "🥈", color: "#9ca3af" },
    { name: "Helpful", icon: "💡", color: "#3b82f6" },
    { name: "Wholesome", icon: "🌻", color: "#22c55e" },
];

export async function ensureDefaultAwards() {
    const query = defineQuery(`count(*[_type == "award"])`);
    const result = await sanityFetch({ query });
    const count = result.data as number;

    if (count > 0) return;

    for (const award of DEFAULT_AWARDS) {
        await adminClient.create({
            _type: "award",
            ...award,
        });
    }
}

export async function getAwards() {
    await ensureDefaultAwards();

    const query = defineQuery(`
        *[_type == "award"] | order(name asc) {
            _id,
            name,
            icon,
            color
        }
    `);

    const result = await sanityFetch({ query });
    return result.data ?? [];
}

export async function getPostAwards(postId: string) {
    const query = defineQuery(`
        *[_type == "awardGrant" && post._ref == $postId] {
            _id,
            createdAt,
            "award": award->{ _id, name, icon, color },
            "grantedBy": grantedBy->{ username }
        } | order(createdAt desc)
    `);

    const result = await sanityFetch({
        query,
        params: { postId },
    });

    return result.data ?? [];
}

export async function grantAward(
    awardId: string,
    grantedById: string,
    postId: string,
) {
    const grant = await adminClient.create({
        _type: "awardGrant",
        award: { _type: "reference", _ref: awardId },
        grantedBy: { _type: "reference", _ref: grantedById },
        post: { _type: "reference", _ref: postId },
        createdAt: new Date().toISOString(),
    });

    return { grant };
}
