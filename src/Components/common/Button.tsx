import React from "react";
import c from "classnames";

const buttonClassesMap = {
    common:
        "inline-flex relative py-2 px-4 border shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary:
        "border-transparent rounded text-white bg-sky-700 hover:bg-sky-800 focus:bg-sky-800 disabled:bg-sky-100 disabled:text-gray-300",
    danger:
        "border-transparent rounded text-white bg-red-600 hover:bg-red-700 focus:ring-red-700 disabled:bg-red-100 disabled:text-gray-300",
};

interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    kind?: keyof typeof buttonClassesMap;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function Button({
    className,
    kind = "primary",
    loading,
    children,
    onClick,
    ...props
}: ButtonProps) {
    let loaderClass = "border-gray-100  border-t-gray-600";
    if (kind === "primary") {
        loaderClass = "border-gray-100 border-t-sky-900";
    }

    return (
        <button
            disabled={loading || props.disabled}
            className={c(buttonClassesMap[kind], buttonClassesMap.common, className)}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <div className="left-0 absolute w-full flex justify-center">
                    <div className={c(`border-2 w-5 h-5 rounded-full animate-spin`, loaderClass)} />
                </div>
            )}
            <span className={loading ? "opacity-0 inline-flex items-center" : "inline-flex items-center"}>
                {children}
            </span>
        </button>
    );
}