
export enum Quality
{
    "COMMON",
    "UNCOMMON",
    "RARE",
    "SPECIAL"
}
export namespace Quality{
    export function ToString(q : Quality):string
    {
        switch(q)
        {
            case Quality.COMMON: return "COMMON"
            case Quality.UNCOMMON: return "UNCOMMON"
            case Quality.RARE: return "RARE"
            case Quality.SPECIAL: return "SPECIAL"
            default: return "ERROR"
        }
    }
}
export enum SaberComponent
{
    "GUARD",
    "GRIP",
    "POMMEL",
    "COMPOSITE"
}