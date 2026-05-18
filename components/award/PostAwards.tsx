type AwardGrant = {
    _id: string;
    award?: {
        icon?: string;
        name?: string;
        color?: string;
    } | null;
};

function PostAwards({ grants }: { grants: AwardGrant[] }) {
    if (!grants.length) return null;

    const grouped = grants.reduce<
        Record<string, { icon: string; name: string; count: number }>
    >((acc, grant) => {
        const key = grant.award?.name ?? "Award";
        if (!acc[key]) {
            acc[key] = {
                icon: grant.award?.icon ?? "🏆",
                name: key,
                count: 0,
            };
        }
        acc[key].count += 1;
        return acc;
    }, {});

    return (
        <div className="flex flex-wrap gap-1 mb-2">
            {Object.values(grouped).map((item) => (
                <span
                    key={item.name}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 border border-amber-200 text-amber-800"
                    title={item.name}
                >
                    <span>{item.icon}</span>
                    {item.count > 1 && <span>{item.count}</span>}
                </span>
            ))}
        </div>
    );
}

export default PostAwards;
