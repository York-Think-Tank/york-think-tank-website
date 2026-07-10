// Shared display helpers.

/** "9 July 2026" for a Strapi ISO timestamp, or null when there's no date. */
export function formatDate(iso: string | null | undefined) {
    return iso
        ? new Date(iso).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : null;
}

/** Day/month/year parts for a calendar-style date stamp, or null when there's no date. */
export function dateStamp(iso: string | null | undefined) {
    if (!iso) return null;
    const d = new Date(iso);
    return {
        day: d.getDate(),
        month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
        year: d.getFullYear()
    };
}
