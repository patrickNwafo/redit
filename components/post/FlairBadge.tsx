function FlairBadge({
    label,
    color = "#ea580c",
}: {
    label: string;
    color?: string;
}) {
    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: color }}
        >
            {label}
        </span>
    );
}

export default FlairBadge;
