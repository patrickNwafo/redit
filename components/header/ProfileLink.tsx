"use client";

import { useUser } from "@clerk/nextjs";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { SidebarMenuButton } from "../ui/sidebar";

function ProfileLink({ sanityUsername }: { sanityUsername?: string | null }) {
    const { user, isLoaded } = useUser();

    if (!isLoaded || !user) return null;

    const username = sanityUsername ?? user.username ?? user.id;

    return (
        <SidebarMenuButton asChild className="p-5">
            <Link href={`/user/${username}`}>
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
            </Link>
        </SidebarMenuButton>
    );
}

export default ProfileLink;
