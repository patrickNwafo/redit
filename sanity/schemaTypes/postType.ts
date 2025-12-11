import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export const postType = defineType({
    name: "post",
    title: "Post",
    type: "document",
    icon: FileText,
    description: "A post is a piece of content created by a user in a subreddit.",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            description: "The title of the post",
            validation: (Rule) => Rule.required().min(1).max(200),
        }),
        defineField({
            name: "originalTitle",
            title: "Original Title",
            type: "string",
            description: "The original title before any edits",
            hidden: true,
        }),
        defineField({
            name: "author",
            title: "Author",
            type: "reference",
            to: [{ type: "user" }],
            description: "The user who created this post",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "subreddit",
            title: "Subreddit",
            type: "reference",
            description: "The subreddit this post belongs to",
            to: [{ type: "subreddit" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "array",
            description: "The main content of the post",
            of: [{ type: "block" }],
        }),
        // defineField({
        //     name: "originalBody",
        //     title: "Original Body",
        //     type: "array",
        //     description: "The original body before any edits",
        //     hidden: true,
        //     of: [{ type: "block" }],
        // }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            description: "URL to the post image",
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alt Text",
                    description: "Alternative text for the image",
                },
            ],
        }),
        defineField({
            name: "isReported",
            title: "Is Reported",
            type: "boolean",
            description: "Whether this post has been reported",
            initialValue: false,
        }),
        defineField({
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
            description: "The date and time this post was published",
            initialValue: new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "isDeleted",
            title: "Is Deleted",
            type: "boolean",
            description: "Whether this post has been deleted",
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "author.username",
            media: "image",
        },
        prepare: ({ title, subtitle, media }) => {
            return {
                title,
                subtitle,
                media,
            };
        },
    },
});
