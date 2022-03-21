import { Effect } from "./Effect";

export class CharacterTrait {
    public name: string;
    public effects = [];

    constructor(
        name: string,
        effects: object
    ) {
        this.name = name;
        for (var effect in effects) {
            this.effects.push(new Effect(null, effect["id"], effect["class"], effect["type"], effect["min"], null));
        }
    }
}