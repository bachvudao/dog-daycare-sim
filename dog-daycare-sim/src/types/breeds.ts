export const BREEDS = [
    'Golden Retriever',
    'Goldendoodle',
    'Poodle',
    'German Shepherd',
    'Pomeranian',
    'Cocker Spaniel',
    'Yorkie',
    'Husky',
    'Labrador',
    'Shiba Inu'
] as const;

export type Breed = typeof BREEDS[number];

// Map breeds to sprite positions (Row, Col) assuming a 3x3 or similar grid?
// The generated image looks like a 3x3 or 4x3 grid.
// Based on the prompt: 10 dogs. Let's assume the order in the prompt matches the grid (L->R, T->B).
// 1. Golden Retriever (0,0)
// 2. Goldendoodle (0,1)
// 3. Poodle (0,2)
// 4. German Shepherd (1,0)
// 5. Pomeranian (1,1)
// 6. Cocker Spaniel (1,2) ?? Wait, the prompt list had 10.
// Let's assume a 3 column layout.
// Row 0: Golden, Goldendoodle, Poodle
// Row 1: G. Shepherd, Pom, Cocker Spaniel ?? 
// Row 2: Yorkie, Husky, Labrador
// Row 3: Shiba Inu
// We'll need to tweak this based on the actual image, but let's write the code to handle sprite offsets.

export const BREED_SPRITES: Record<Breed, { x: number; y: number }> = {
    'Golden Retriever': { x: 0, y: 0 },
    'Goldendoodle': { x: 1, y: 0 },
    'Poodle': { x: 2, y: 0 },
    'German Shepherd': { x: 0, y: 1 },
    'Pomeranian': { x: 1, y: 1 },
    'Cocker Spaniel': { x: 2, y: 1 },
    'Yorkie': { x: 0, y: 2 },
    'Husky': { x: 1, y: 2 },
    'Labrador': { x: 2, y: 2 },
    'Shiba Inu': { x: 0, y: 3 }
};

export const getSpritePosition = (index: number) => {
    const cols = 3;
    const row = Math.floor(index / cols);
    const col = index % cols;
    return { x: col, y: row };
};
