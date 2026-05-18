import { defineField, defineType } from "sanity";
import { Award } from "lucide-react";

export const awardType = defineType({
    name: "award",
    title: "Award",
    type: "document",
    icon: Award,
    description: "Award types that users can give to posts and comments",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "icon",
            title: "Icon",
            type: "string",
            description: "Emoji or short label shown on the award",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "color",
            title: "Color",
            type: "string",
            description: "Hex color for the award badge",
            initialValue: "#f97316",
        }),
    ],
});
