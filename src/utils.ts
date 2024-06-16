export function toRGB(hex: string) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return [r / 255, g / 255, b / 255, 1.0];
}

export function nullCheck<T>(value: T | null, message: string): asserts value is T{
    if (value === null) {
        throw new Error(message);
    }
}