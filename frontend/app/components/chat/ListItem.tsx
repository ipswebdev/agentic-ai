
import { ReactNode } from "react";

interface ListItemProps {
    title: string;
    subtitle?: string;
    onClick: () => void;
    children?: ReactNode;
    selected?: boolean;
}

export default function ListItem({
    title,
    subtitle,
    onClick,
    children,
    selected = false,
}: ListItemProps) {
    return (
        <div
            className={`
                border-b border-zinc-800
                px-4 py-3
                transition-colors
                ${selected ? "bg-zinc-800 border-l-2 border-l-blue-500" : ""}
            `}
        >
            <button
                type="button"
                onClick={onClick}
                aria-pressed={selected}
                className="block w-full text-left"
            >
                <p className="truncate text-sm font-medium text-zinc-100">
                    {title}
                </p>

                {subtitle && (
                    <p className="mt-1 truncate text-xs text-zinc-400">
                        {subtitle}
                    </p>
                )}
            </button>

            {children}
        </div>
    );
}
