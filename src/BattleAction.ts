import { Character } from "./Character";
import { Effect } from "./Effect";

export class BattleAction {
    public source: Character;
    public target: Character;
    public effect: Effect;

    constructor(
        source: Character,
        target: Character,
        effect: Effect
    ){};
}