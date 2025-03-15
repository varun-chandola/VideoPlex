export const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return rtf.format(-diffInMinutes, "minute");
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return rtf.format(-diffInHours, "hour");
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return rtf.format(-diffInDays, "day");
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return rtf.format(-diffInMonths, "month");
    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, "year");
};