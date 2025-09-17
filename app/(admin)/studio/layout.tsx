import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
    title: "Reddit Sanity Admin Panel",
    description: "Reddit Sanity Admin Panel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body>
                    <div>{children}</div>
                </body>
            </html>
        </ClerkProvider>
    );
}
