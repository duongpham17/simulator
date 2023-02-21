export type TradingStrategy = "counter" | "counter long only" | "counter short only" | "trend" | "trend long only" | "trend short only";

export type Side = "buy" | "sell" | "both";

interface Strategies {
    name: TradingStrategy,
    description: string,
    side: Side
};

export const strategies: Strategies[] = [
    {
        name: "counter",
        side: "both",
        description: `
            Short market pumps and long market dumps
        `,
    },
    {
        name: "counter long only",
        side: "buy",
        description: `
            Only long when market dumps
        `,
    },
    {
        name: "counter short only",
        side: "sell",
        description: `
            Only short market pumps
        `
    },
    {
        name: "trend",
        side: "both",
        description: `
            Short market dumps and long market pumps
        `
    },
    {
        name: "trend long only",
        side: "buy",
        description: `
            Only long when the market pumps
        `
    },
    {
        name: "trend short only",
        side: "sell",
        description: `
            Only short when the market dumps
        `
    },
];

export const find_side = (name: string | undefined): Side => {
    if(name === undefined) return "both";
    const s = strategies.find(el => el.name === name);
    if(!s) return "both"
    return s.side
}

export default strategies