import { defineField, defineType } from "sanity";
import { ArrowDown, ArrowUp } from "lucide-react";

export const votedType = defineType({
    name: "vote",
    title: "Vote",
    type: "document",
    icon: ArrowUp,
    description: "Tracks user votes on posts and comments",
    fields: [
        defineField({
            name: "user",
            title: "User",
            type: "reference",
            to: [{ type: "user" }],
            description: "The user who voted on this post",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "voteType",
            title: "Vote Type",
            type: "string",
            description: "The type of vote (upvote or downvote)",
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: "Upvote", value: "upvote" },
                    { title: "Downvote", value: "downvote" },
                ],
            },
        }),
        defineField({
            name: "post",
            title: "Post",
            type: "reference",
            to: [{ type: "post" }],
            description: "The post this vote belongs to",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "comment",
            title: "Comment",
            type: "reference",
            to: [{ type: "comment" }],
            description: "The comment this vote belongs to",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            description: "The date and time this vote was created",
            initialValue: new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            votedType: "voteType",
            postTitle: "post.title",
            commentTitle: "comment.title",
            username: "user.username",
        },
        prepare(selection) {
            const { votedType, postTitle, commentTitle, username } = selection;
            return {
                title: postTitle || commentTitle,
                subtitle: username,
                media: votedType === "upvote" ? <ArrowUp /> : <ArrowDown />,
            };
        },
    },
    validation: (rule) =>
        rule.custom((fields) => {
            if (fields?.post && fields?.comment) {
                return "A vote can only be on a post or a comment, not both.";
            }
            if (!fields?.post && !fields?.comment) {
                return "Must vote on either a post or a comment.";
            }
            return true;
        }),
});
