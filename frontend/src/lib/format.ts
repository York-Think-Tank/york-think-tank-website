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

/** "5:30 pm" for a Strapi ISO timestamp, or null when there's no date. */
export function formatTime(iso: string | null | undefined) {
    return iso
        ? new Date(iso).toLocaleTimeString('en-GB', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
          })
        : null;
}

/** Split events on event_date: upcoming (soonest first) and previous (most recent first). */
export function splitEvents(events: any[]) {
    const now = Date.now();
    const upcoming = events
        .filter((e) => new Date(e.event_date).getTime() >= now)
        .sort((a, b) => +new Date(a.event_date) - +new Date(b.event_date));
    const previous = events
        .filter((e) => new Date(e.event_date).getTime() < now)
        .sort((a, b) => +new Date(b.event_date) - +new Date(a.event_date));
    return { upcoming, previous };
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
