export function createPairs(list: string[]): { id1: string, id2: string }[] {
    const pairs: { id1: string, id2: string }[] = [];

    for (let i = 0; i < list.length - 1; i++) {
        const pair = {
            id1: list[i],
            id2: list[i + 1]
        };
        pairs.push(pair);
    }

    return pairs;
}
export function pairLocations(locations: Location[]): [Location, Location][] {
    const pairs: [Location, Location][] = [];

    for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
            pairs.push([locations[i], locations[j]]);
        }
    }

    return pairs;
}

export const convertBlobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
    });

interface Location {
    id: string;
    latitude: number;
    longitude: number;
    idOrder: number;
    type: string;
    name: string;
    orderValue: number;
}