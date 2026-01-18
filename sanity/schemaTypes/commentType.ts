import { defineField, defineType } from "sanity";
import { MessageCircle } from "lucide-react";

export const commentType = defineType({
    name: "comment",
    title: "Comment",
    type: "document",
    icon: MessageCircle,
    description: "A comment on a post or another comment.",
    fields: [
        defineField({
            name: "content",
            title: "Content",
            type: "text",
            description: "The main content of the comment",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "author",
            title: "Author",
            type: "reference",
            to: [{ type: "user" }],
            description: "The user who created this comment",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "post",
            title: "Post",
            type: "reference",
            to: [{ type: "post" }],
            description: "The post this comment belongs to",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "parentComment",
            title: "Parent Comment",
            type: "reference",
            to: [{ type: "comment" }],
            description: "The parent comment this comment belongs to",
        }),
        defineField({
            name: "isReported",
            title: "Is Reported",
            type: "boolean",
            description: "Whether this comment has been reported",
            initialValue: false,
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            description: "The date and time this comment was created",
            initialValue: new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "isDeleted",
            title: "Is Deleted",
            type: "boolean",
            description: "Whether this comment has been deleted",
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: "content",
            subtitle: "author.username",
        },
        prepare: ({ title, subtitle }) => {
            return {
                title,
                subtitle,
            };
        },
    },
});
