import { Effect } from "./Effect";


export class Item {
    public name: string;
    public type: string;
    public subtype: string;
    public slot: string;
    public level: number;
    public effects = [];

    constructor(
        name: string,
        type: string,
        subtype: string,
        slot: string,
        level: number,
        effects: object
    ) {
        this.name = name;
        this.type = type;
        this.subtype = subtype;
        this.slot = slot;
        this.level = level;
        for (var effect in effects) {
            this.effects.push(new Effect(null, effect["id"], effect["class"], effect["type"], effect["amt"], null));
        }
    };
}