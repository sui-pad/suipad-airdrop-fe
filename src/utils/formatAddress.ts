


export function equalAddress(address: string | null, contrast?: string) {
    if (!address || !contrast) return false;

    return address.toLowerCase() === contrast.toLowerCase();
}

export function formatAddressShort(address: string, fill: string = "-") {
    if (!address) return fill;

    return address.substring(0, 6) + "..";
}

export function formatAddress({ address, slices = [6, 4], fill = "-" }:
    {
        address?: string | null
        slices?: [number, number]
        fill?: string,
    }) {
    if (!address) return fill;

    return address.substring(0, slices[0]) + "..." + address.substring(address.length - slices[1]);
}