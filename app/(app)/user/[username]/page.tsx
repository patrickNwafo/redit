import PostsList from "@/components/post/PostsList";
import { getUserKarma } from "@/sanity/lib/user/getUserKarma";
import { getUserByUsername } from "@/sanity/lib/user/getUserByUsername";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserCircle } from "lucide-react";
import TimeAgo from "@/components/TimeAgo";

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    const profile = await getUserByUsername(username);

    if (!profile || profile.isBanned) {
        notFound();
    }

    const karma = await getUserKarma(profile._id);
    const clerkUser = await currentUser();
    const isOwnProfile = clerkUser?.id === profile._id;

    return (
        <>
            <section className="bg-white border-b">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex items-start gap-4">
                        {profile.imageUrl ? (
                            <Image
                                src={profile.imageUrl}
                                alt={profile.username ?? "User"}
                                width={72}
                                height={72}
                                className="rounded-full object-cover w-[72px] h-[72px]"
                            />
                        ) : (
                            <UserCircle className="w-[72px] h-[72px] text-gray-300" />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold">
                                u/{profile.username}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {karma.totalKarma.toLocaleString()} karma ·{" "}
                                {karma.postKarma} post · {karma.commentKarma}{" "}
                                comment
                            </p>
                            {profile.joinedAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Joined{" "}
                                    <TimeAgo date={new Date(profile.joinedAt)} />
                                </p>
                            )}
                            {profile.bio && (
                                <p className="text-sm text-gray-700 mt-2 max-w-lg">
                                    {profile.bio}
                                </p>
                            )}
                            {isOwnProfile && (
                                <p className="text-xs text-orange-600 mt-2 font-medium">
                                    This is your profile
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="my-8">
                <div className="mx-auto max-w-7xl px-4">
                    <h2 className="text-lg font-semibold mb-4">Posts</h2>
                    <PostsList
                        authorUsername={username}
                        emptyMessage="This user hasn't posted yet."
                    />
                </div>
            </section>
        </>
    );
}
