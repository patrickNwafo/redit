import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";
import Image from "next/image";

export const userType = defineType({
    name: "user",
    title: "User",
    type: "document",
    icon: UserIcon,
    fields: [
        defineField({
            name: "username",
            title: "Username",
            type: "string",
            description: "The unique username for this user",
            validation: (Rule) => Rule.required().min(3).max(30),
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
            description: "The email address for this user",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "imageUrl",
            title: "Image URL",
            type: "url",
            description: "The URL to the profile image for this user",
            validation: (Rule) =>
                Rule.uri({
                    scheme: ["http", "https"],
                }),
        }),
        defineField({
            name: "joinedAt",
            title: "Joined At",
            type: "datetime",
            description: "The date and time this user joined",
            initialValue: new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "isReported",
            title: "Is Reported",
            type: "boolean",
            description: "Whether this user has been reported",
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: "username",
            media: "imageUrl",
        },
        prepare: ({ title, media }) => {
            return {
                title,
                media: media ? (
                    <Image
                        src={media}
                        alt={`${title}'s avatar`}
                        width={40}
                        height={40}
                    />
                ) : (
                    <UserIcon />
                ),
            };
        },
    },
});
