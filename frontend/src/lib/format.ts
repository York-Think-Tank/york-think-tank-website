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
