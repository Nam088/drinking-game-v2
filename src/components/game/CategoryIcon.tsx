interface CategoryIconProps {
    category: string
    className?: string
}

export const CategoryIcon = ({ category, className = "" }: CategoryIconProps) => {
    const c = category.toUpperCase().trim()

    // Default size and color classes
    const baseClass = className || "w-12 h-12"

    switch (c) {
        case "DARE":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                    <path d="M8 11.5C8 10.1193 9.11929 9 10.5 9C11.8807 9 13 10.1193 13 11.5C13 12.8807 11.8807 14 10.5 14C9.11929 14 8 12.8807 8 11.5Z" fill="white" />
                    <path d="M11 11.5C11 10.1193 12.1193 9 13.5 9C14.8807 9 16 10.1193 16 11.5C16 12.8807 14.8807 14 13.5 14C12.1193 14 11 12.8807 11 11.5Z" fill="white" />
                </svg>
            )
        case "TRUTH":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" />
                    <path d="M8 10C8 9.44772 8.44772 9 9 9C9.55228 9 10 9.44772 10 10C10 10.5523 9.55228 11 9 11C8.44772 11 8 10.5523 8 10Z" fill="white" />
                    <path d="M14 10C14 9.44772 14.4477 9 15 9C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11C14.4477 11 14 10.5523 14 10Z" fill="white" />
                    <path d="M8 14H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            )
        case "GROUP_TRUTH":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="currentColor" />
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="currentColor" />
                    <path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3" stroke="currentColor" strokeWidth="2" />
                    <path d="M6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3" stroke="currentColor" strokeWidth="2" />
                </svg>
            )
        case "PARTNER":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.90831 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.6417 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7564 5.72723 21.351 5.12082 20.84 4.61V4.61Z" fill="currentColor" />
                </svg>
            )
        case "MINI-GAME":
        case "VOTE":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
                    <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />
                    <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
                    <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" />
                    <circle cx="7" cy="7" r="1.5" fill="white" />
                    <circle cx="17" cy="7" r="1.5" fill="white" />
                    <circle cx="7" cy="17" r="1.5" fill="white" />
                    <circle cx="17" cy="17" r="1.5" fill="white" />
                </svg>
            )
        case "BRAIN":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 2C8.96957 2 8.46086 2.21071 8.08579 2.58579C7.71071 2.96086 7.5 3.46957 7.5 4C7.5 4.11 7.51 4.22 7.53 4.33C6.94 4.13 6.3 4 5.63 4C3.13 4 1 6.13 1 8.63C1 9.53 1.25 10.37 1.68 11.09C1.27 11.78 1 12.6 1 13.5C1 15.93 2.93 17.94 5.35 18C5.82 19.72 7.35 21 9.13 21C10.19 21 11.17 20.59 11.9 19.93C12.63 20.59 13.61 21 14.67 21C16.45 21 17.98 19.72 18.45 18C20.87 17.94 22.8 15.93 22.8 13.5C22.8 12.6 22.53 11.78 22.12 11.09C22.55 10.37 22.8 9.53 22.8 8.63C22.8 6.13 20.67 4 18.17 4C17.5 4 16.86 4.13 16.27 4.33C16.29 4.22 16.3 4.11 16.3 4C16.3 2.9 15.4 2 14.3 2H9.5Z" fill="currentColor" />
                </svg>
            )
        case "SKILL":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
                </svg>
            )
        case "CURSE":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2Z" fill="currentColor" />
                    <path d="M8 9L10 11L8 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 9L14 11L16 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 16C8 16 9.5 18 12 18C14.5 18 16 16 16 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            )
        case "BUDDY":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" />
                </svg>
            )
        case "ITEM":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z" fill="currentColor" />
                    <path d="M9 10H11V18H9V10Z" fill="currentColor" />
                    <path d="M13 10H15V18H13V10Z" fill="currentColor" />
                </svg>
            )
        case "SECRET":
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="currentColor" />
                </svg>
            )
        default:
            // Default icon - Glass
            return (
                <svg className={baseClass} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 2L5 20.23C5.13 21.23 5.97 22 7 22H17C18.03 22 18.87 21.23 19 20.23L21 2H3ZM5.2 4H18.8L17.33 18H6.67L5.2 4ZM9 6L10 14H11L10 6H9ZM13 6L14 14H15L14 6H13Z" fill="currentColor" />
                </svg>
            )
    }
}
