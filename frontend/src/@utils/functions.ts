const randomid = (): string => {
    const id = Math.random().toString(36).substring(7);
    return id;
};

export const generateid = (times: number = 2): string => {
    const id = Array.from({length: times}, () => randomid()).join("");
    return id
};

export const shortenword = (word: string, length?: number): string => {
    const s = `${word.substring(0, length ? length : 20)}...`;
    return s;
}

export const firstcaps = (word: string): string => {
    const s = word.split(" ").map((w: string) => w.substring(0, 1).toUpperCase() + w.substring(1)).join(" ");
    return s
};

export const ellipsis = (text: string, end=40) => {
    const s = `${text.substring(0, end).trim()}${text.length >= end ? "..." : ""}`;
    return s;
} 

export const breakword = (word: string, first: number, last: number): string => {
    if(!word) return "";
    const s = `${word.substring(0, first ? first : 20)}...${word.substring(last)}`;
    return s;
};

export const copyToClipboard = (s: string): void => {
    navigator.clipboard.writeText(s)
};

export const reload = (): void => {
    return window.location.reload()
};

export const redirect = (url: string = "/"): void => {
    return window.location.replace(url);
};

export const httpsIpfs = (cid: string): string => {
    return `https://ipfs.io/ipfs/${cid}`;
};

export const cloneObject = <T>(object: T): T => {
    return JSON.parse(JSON.stringify(object));
};

export const isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
};

export const date = (iso: string | Date, length=0): string => {
    return iso.toLocaleString().split("T").join(" ").slice(length, 19);
};

export const timerLess24 = (future_time: number) => {
    return new Date(future_time - Date.now()).toISOString().slice(11,19);
};

export const timerGreater24 = (future_time: number) => {
    const hours = `0${new Date(future_time - Date.now()).getHours() - 1}`.slice(-2);
    const minutes = `0${new Date(future_time - Date.now()).getMinutes()}`.slice(-2);
    const seconds = `0${new Date(future_time - Date.now()).getSeconds()}`.slice(-2);
    return `${hours}:${minutes}:${seconds}`;
};

export const second_till_zero = (minute: number) => {
    const current_hours_in_milliseconds : number = Number(Date.now().toString().slice(-7));
    const mod = current_hours_in_milliseconds % (60000 * minute);
    const convert_to_seconds = mod / 1000;
    const second_to_zero = (minute * 60) - Math.trunc(convert_to_seconds);
    return second_to_zero
};