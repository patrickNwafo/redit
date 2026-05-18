import { defineField, defineType } from "sanity";
import { Gift } from "lucide-react";

export const awardGrantType = defineType({
    name: "awardGrant",
    title: "Award Grant",
    type: "document",
    icon: Gift,
    description: "An award given to a post or comment",
    fields: [
        defineField({
            name: "award",
            title: "Award",
            type: "reference",
            to: [{ type: "award" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "grantedBy",
            title: "Granted By",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "post",
            title: "Post",
            type: "reference",
            to: [{ type: "post" }],
        }),
        defineField({
            name: "comment",
            title: "Comment",
            type: "reference",
            to: [{ type: "comment" }],
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
    ],
    validation: (rule) =>
        rule.custom((fields) => {
            if (fields?.post && fields?.comment) {
                return "An award can only be on a post or a comment, not both.";
            }
            if (!fields?.post && !fields?.comment) {
                return "Must award either a post or a comment.";
            }
            return true;
        }),
});
