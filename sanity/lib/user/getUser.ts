import { sanityFetch } from "../live";
import { defineQuery } from "groq";
import { addUser } from "./addUser";
import { currentUser } from "@clerk/nextjs/server";

interface UserResult {
    _id: string;
    username: string;
    imageUrl: string;
    email: string;
}

export async function getUser(): Promise<UserResult | { error: string }> {
    try {
        console.log("Getting current user from Clerk");
        const loggedInUser = await currentUser();

        if (!loggedInUser) {
            console.log("No user logged in");
            return { error: "User not found" };
        }

        console.log(`Found Clerk user: ${loggedInUser.id}`);

        const getExistingUserQuery = defineQuery(
            `*[_type == "user && _id == $id][0]`
        );

        console.log("Checking if user exists in Sanity database");
        const existingUser = await sanityFetch({
            query: getExistingUserQuery,
            params: {
                id: loggedInUser.id,
            },
        });

        if (existingUser.data?._id) {
            console.log(
                `User found in database with ID: ${existingUser.data._id}`
            );
            const user = {
                _id: existingUser.data._id,
                username: existingUser.data.username!,
                imageUrl: existingUser.data.imageUrl!,
                email: existingUser.data.email!,
            };
            console.log("Returning user from database");
            return user;
        }

        console.log("User not found in database");

        const newUser = await addUser({
            id: loggedInUser.id,
            username: parseUsername(loggedInUser.fullName),
            email: loggedInUser.primary,
        });
    } catch (error) {}
}
