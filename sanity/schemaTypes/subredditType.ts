import { defineField, defineType } from "sanity";
import { TagIcon } from "lucide-react";

export const subredditType = defineType({
    name: "subreddit",
    title: "Subreddit",
    type: "document",
    icon: TagIcon,
    description:
        "A subreddit is a community of users who share an interest in a specific topic.",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            description: "The display title of the subreddit",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            description: "The description of the subreddit",
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            description: "The unique URL slug for the subreddit",
            options: {
                source: "title",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            description: "The image for the subreddit",
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
            name: "moderator",
            title: "Moderator",
            type: "reference",
            to: [{ type: "user" }],
            description: "The moderator of this subreddit",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            description: "The date and time this subreddit was created",
            initialValue: new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: "title",
            media: "image",
        },
    },
});
