import { Expose, Transform } from 'class-transformer';

/**
 * Transformer pour formater les dates en ISO 8601 (YYYY-MM-DDTHH:mm:ss)
 * Les dates sont stockées en ISO dans la base, mais on peut les transformer à l'affichage
 */
export function FormatDate() {
  return Transform(({ value }) => {
    if (!value) return null;
    if (value instanceof Date) {
      return value.toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss
    }
    return value;
  });
}

/**
 * Transformer pour afficher les dates en français lisible : "29 Jan 2026, 19:07"
 */
export function FormatDateFR() {
  return Transform(({ value }) => {
    if (!value) return null;
    if (value instanceof Date) {
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      return new Intl.DateTimeFormat('fr-FR', options).format(value);
    }
    return value;
  });
}
