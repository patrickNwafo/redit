import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getUserByUsername(username: string) {
    const query = defineQuery(`
        *[_type == "user" && username == $username][0] {
            _id,
            username,
            email,
            imageUrl,
            bio,
            joinedAt,
            isBanned
        }
    `);

    const result = await sanityFetch({
        query,
        params: { username },
    });

    return result.data;
}
