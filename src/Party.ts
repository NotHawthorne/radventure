import { Character } from "./Character";

export class Party {
    public characters = [];

    public charactersInParty(): number {
        return this.characters.length;
    }
    public addCharacter(c: Character): void {
        this.characters.push(c);
    }
    public removeCharacter(name: string): void {
        for (var i = 0; i != this.characters.length; i++) {
            if (this.characters[i].getName() == name) {
                this.characters.splice(i, 1);
                break ;
            }
        }
    }
    public getCharacter(name: string): Character {
        for (var i = 0; i != this.characters.length; i++) {
            if (this.characters[i].getName() == name) {
                return this.characters[i];
            }
        }
        return null;
    }
}