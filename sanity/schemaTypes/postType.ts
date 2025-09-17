import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export const postType = defineType({
    name: "post",
    title: "Post",
    type: "document",
    icon: FileText,
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
            type: "string",
            description: "The subreddit this post belongs to",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "text",
            description: "The main content of the post",
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "url",
            description: "URL to the post image",
        }),
        defineField({
            name: "alt",
            title: "Alt Text",
            type: "string",
            description: "Alternative text for the image",
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
