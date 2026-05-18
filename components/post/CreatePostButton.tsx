"use client";

import { createPost } from "@/actions/createPost";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

type SubredditOption = {
    _id: string;
    title?: string | null;
};

type PostKind = "text" | "image" | "link";

function CreatePostButton({
    subreddits,
    defaultSubredditId,
}: {
    subreddits: SubredditOption[];
    defaultSubredditId?: string;
}) {
    const { user } = useUser();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [postKind, setPostKind] = useState<PostKind>("text");
    const [subredditId, setSubredditId] = useState(
        defaultSubredditId || subreddits[0]?._id || "",
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (defaultSubredditId) {
            setSubredditId(defaultSubredditId);
        }
    }, [defaultSubredditId]);

    const resetForm = () => {
        setTitle("");
        setBody("");
        setLinkUrl("");
        setPostKind("text");
        setErrorMessage(null);
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        startTransition(async () => {
            try {
                let imageBase64: string | null = null;
                let fileName: string | null = null;
                let fileType: string | null = null;

                if (imageFile && postKind === "image") {
                    imageBase64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(imageFile);
                    });
                    fileName = imageFile.name;
                    fileType = imageFile.type;
                }

                const result = await createPost(
                    title,
                    postKind,
                    subredditId,
                    body || undefined,
                    linkUrl || undefined,
                    imageBase64,
                    fileName,
                    fileType,
                );

                if ("error" in result && result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                setOpen(false);
                resetForm();
                router.refresh();
            } catch (err) {
                console.error("Failed to create post", err);
                setErrorMessage("Failed to create post");
            }
        });
    };

    const kinds: { value: PostKind; label: string }[] = [
        { value: "text", label: "Text" },
        { value: "image", label: "Image" },
        { value: "link", label: "Link" },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={!user}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {user ? "Create Post" : "Sign in to post"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create a post</DialogTitle>
                    <DialogDescription>
                        Share text, an image, or a link with a community.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    )}

                    <div className="flex gap-2">
                        {kinds.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setPostKind(value)}
                                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                    postKind === value
                                        ? "border-orange-500 bg-orange-50 text-orange-700"
                                        : "border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <CommunitySelect
                        subreddits={subreddits}
                        subredditId={subredditId}
                        onChange={setSubredditId}
                    />

                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="An interesting title"
                            required
                            maxLength={200}
                        />
                    </div>

                    {postKind === "link" && (
                        <div className="space-y-2">
                            <label htmlFor="linkUrl" className="text-sm font-medium">
                                URL
                            </label>
                            <Input
                                id="linkUrl"
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="body" className="text-sm font-medium">
                            {postKind === "link" ? "Optional text" : "Body"}
                        </label>
                        <Textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder={
                                postKind === "link"
                                    ? "Add context (optional)"
                                    : "What's on your mind?"
                            }
                            rows={4}
                        />
                    </div>

                    {postKind === "image" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Image</label>
                            {imagePreview ? (
                                <div className="relative w-full h-40">
                                    <Image
                                        src={imagePreview}
                                        alt="Post preview"
                                        fill
                                        className="object-contain rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                                    >
                                        x
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                    <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-sm text-gray-500">
                                        Upload image
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        required={!imagePreview}
                                    />
                                </label>
                            )}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        disabled={isPending || !user || !subredditId}
                    >
                        {isPending ? "Posting..." : "Post"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function CommunitySelect({
    subreddits,
    subredditId,
    onChange,
}: {
    subreddits: SubredditOption[];
    subredditId: string;
    onChange: (id: string) => void;
}) {
    return (
        <div className="space-y-2">
            <label htmlFor="subreddit" className="text-sm font-medium">
                Community
            </label>
            <select
                id="subreddit"
                value={subredditId}
                onChange={(e) => onChange(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
                {subreddits.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                        c/{sub.title}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CreatePostButton;
