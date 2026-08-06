export function IconNetwork({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="2.5" stroke={color} strokeWidth="1.5" />
            <circle cx="5" cy="18" r="2.5" stroke={color} strokeWidth="1.5" />
            <circle cx="19" cy="18" r="2.5" stroke={color} strokeWidth="1.5" />
            <path d="M12 7.5V12M12 12L6.5 15.8M12 12L17.5 15.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function IconHardware({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="12" rx="1.5" stroke={color} strokeWidth="1.5" />
            <path d="M8 20h8M12 16v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function IconSoftware({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
                  stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function IconAccess({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="1.5" stroke={color} strokeWidth="1.5" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="1.5" />
            <circle cx="12" cy="15.5" r="1.4" fill={color} />
        </svg>
    );
}

export function IconBox({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M3 8l9-5 9 5-9 5-9-5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 8v8l9 5 9-5V8M12 13v8" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export function IconGear({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
            <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.3.9a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.5a7.7 7.7 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.4 2.3-.9c.75.66 1.63 1.17 2.6 1.5l.5 2.5h4l.5-2.5a7.7 7.7 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.5z"
                  stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
    );
}

export function IconTicket({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.8 1.8 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.8 1.8 0 0 0 0-3V9z"
                  stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 7v10" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
    );
}

export function IconCheck({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
            <path d="M8 12.5l2.5 2.5L16 9.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconBarChart({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconPieChart({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.5" />
            <path d="M12 4v8l6.5-4.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export function IconFolder({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M3 7a1.5 1.5 0 0 1 1.5-1.5h4l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H4.5A1.5 1.5 0 0 1 3 17.5V7z"
                  stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export function IconUser({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.2" stroke={color} strokeWidth="1.5" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function IconCalendar({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="5" width="17" height="15" rx="1.5" stroke={color} strokeWidth="1.5" />
            <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function IconBot({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="4" y="8" width="16" height="11" rx="2.5" stroke={color} strokeWidth="1.5" />
            <path d="M12 8V4.5M9.5 4.5h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="13.5" r="1.2" fill={color} />
            <circle cx="15" cy="13.5" r="1.2" fill={color} />
        </svg>
    );
}

export function IconLoader({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.5" opacity="0.25" />
            <path d="M20.5 12a8.5 8.5 0 0 0-8.5-8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function IconInbox({ size = 24, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M3.5 12h5l1.5 2.5h4L15.5 12h5" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3.5 12l1.7-6.3A1.5 1.5 0 0 1 6.65 4.5h10.7a1.5 1.5 0 0 1 1.45 1.2L20.5 12v5.5A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5V12z"
                  stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export function Dot({ size = 12, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
            <circle cx="6" cy="6" r="6" fill={color} />
        </svg>
    );
}