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

function CreateCommunityButton() {
    const { user } = useUser();
    return (
        <Dialog>
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
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCommunityButton;
