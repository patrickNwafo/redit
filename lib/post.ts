export function getPostBodyText(
    body: Array<{
        children?: Array<{ text?: string }>;
    }> | null | undefined,
) {
    if (!body?.length) return null;
    return body
        .map((block) =>
            block.children?.map((child) => child.text ?? "").join(""),
        )
        .filter(Boolean)
        .join("\n");
}
