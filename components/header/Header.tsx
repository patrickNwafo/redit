"use client";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    // useUser,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import ReddishLogo from "@/images/Reddish Full.png";
import ReddisLogoOnly from "@/images/Reddish Logo Only.png";
import Image from "next/image";
import { MenuIcon, ChevronLeftIcon } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
function Header() {
    // const { user } = useUser();
    const { toggleSidebar, open, isMobile } = useSidebar();

    // const isBanned = user?.publicMetadata["IS_BANNED"] as boolean;
    return (
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
            {/*Left Side  */}
            <div className="flex items-center gap-2 h-10">
                {open && !isMobile ? (
                    <ChevronLeftIcon
                        className="w-6 h-6"
                        onClick={toggleSidebar}
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <MenuIcon className="w-6 h-6" onClick={toggleSidebar} />
                        <Image
                            src={ReddishLogo}
                            alt="Reddish Logo"
                            width={150}
                            height={150}
                            className="hidden md:block"
                        />
                        <Image
                            src={ReddisLogoOnly}
                            alt="Reddish Logo"
                            width={40}
                            height={40}
                            className="md:hidden block"
                        />
                    </div>
                )}
            </div>

            {/* Right Side  */}
            <div>
                <SignedIn>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <Button asChild variant="outline">
                        <SignInButton mode="modal" />
                    </Button>
                </SignedOut>
            </div>
        </header>
    );
}

export default Header;
