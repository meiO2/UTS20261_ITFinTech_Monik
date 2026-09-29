    // Shared helpers + settings

    // Change this if your tax / service rate is different (0.10 = 10%)
    export const TAX_RATE = 0.1;

    export function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    })
        .format(value)
        .replace(/\s/g, " ");
    }