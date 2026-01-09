
export const parseBrDate = (dateString?: string): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        // Validate parts to avoid invalid dates like 31/02
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime()) && date.getDate() === day) {
            return date;
        }
    }
    return null;
};

interface SortOptions {
    numeric?: boolean;
    date?: boolean;
    ignoreAccents?: boolean;
}

export const compareValues = (
    a: any,
    b: any,
    order: 'asc' | 'desc' = 'asc',
    options: SortOptions = {}
): number => {
    const dir = order === 'asc' ? 1 : -1;

    if (a === b) return 0;
    if (a === null || a === undefined || a === '') return 1; // Empty/null values at the bottom
    if (b === null || b === undefined || b === '') return -1;

    if (options.date) {
        const da = typeof a === 'string' ? parseBrDate(a) : (a instanceof Date ? a : null);
        const db = typeof b === 'string' ? parseBrDate(b) : (b instanceof Date ? b : null);

        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;

        return (da.getTime() - db.getTime()) * dir;
    }

    if (typeof a === 'string' && typeof b === 'string') {
        let valA = a.trim();
        let valB = b.trim();

        if (options.ignoreAccents) {
            valA = valA.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            valB = valB.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        return valA.localeCompare(valB, 'pt-BR', {
            sensitivity: 'base',
            numeric: true
        }) * dir;
    }

    if (a < b) return -1 * dir;
    if (a > b) return 1 * dir;
    return 0;
};
