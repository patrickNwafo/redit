"use server";

export type ImageData = {
    base64: string;
    fileName: string;
    contentType: string;
} | null;

export async function createCommunity(
    name: string,
    imageBase64: string | null | undefined,
    imageFileName: string | null | undefined,
    imageContentType: string | null | undefined,
    slug?: string,
    description?: string
) {
    try {
    } catch (error) {
        console.error("Error in creating community", error);
        return {
            error: "Failed to create community",
        };
    }
}
