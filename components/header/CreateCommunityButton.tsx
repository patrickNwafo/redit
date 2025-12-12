"use client";

import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

function CreateCommunityButton() {
    const { user } = useUser();
    const [errorMessage, setErrorMessage] = useState<string | null>("");
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);

        if (!slug || slug === generateSlug(name)) {
            setSlug(generateSlug(value));
        }
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-{2,}/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 21);
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="w-full p-2 pl-5 flex items-center rounded-md cursor-pointer bg-black text-white hover:bg-black transition-all duration-200 disabled:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!user}
            >
                <Plus className="w-4 h-4 mr-2" />
                {user ? "Create Community" : "Sign in to create a community"}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Community</DialogTitle>
                    <DialogDescription>
                        Create a community for you and your friends to discuss
                        anything you like.
                    </DialogDescription>

                    <form>
                        {errorMessage && (
                            <div className="text-red-500 text-sm">
                                {errorMessage}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Comunnity Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Community name"
                                value={name}
                                onChange={handleNameChange}
                                required
                                minLength={3}
                                maxLength={21}
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="slug"
                                className="text-sm font-medium"
                            >
                                Community Slug (URL)
                            </label>
                            <Input
                                id="slug"
                                name="slug"
                                type="text"
                                placeholder="my-community"
                                className="w-full focus:ring-2 focus:ring-blue-500"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                minLength={3}
                                maxLength={21}
                                pattern="[a-z0-9-]+"
                                title="Community slug must be 3-21 characters long and contain only letters, numbers, and hyphens."
                            />
                            <p className="text-xs text-gray-500">
                                This will be used in the URL:
                                reddish.com/community/{slug || "community slug"}
                            </p>
                        </div>

                        <div className="space-y-7">
                            <label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Description
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="What is this community about?"
                                rows={3}
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-blue-500"
                            />
                        </div>

                        {/* Image */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Community Image (optional)
                            </label>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCommunityButton;
