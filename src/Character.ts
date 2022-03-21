const statData = require("../data/statData.json");

export class Character {
    public name: string;
    public characterClass: string;
    public characterRace: string;
    public level: number;
    public stats = {};
    
    constructor(
        name: string,
        characterClass: string,
        characterRace: string,
        level: number,
        stats: object        
    ) {
        this.name = name;
        this.characterClass = characterClass;
        this.characterRace = characterRace;
        this.level = level;
        if (stats == null || stats == {}) {
            for (var key in statData.stats) {
                stats[key] = 0;
            }
            stats["Health"] = 10;
            stats["Strength"] = 5;
            stats["Stamina"] = 5;
            stats["Intellect"] = 5;
            stats["Wisdom"] = 5;
            stats["Alacrity"] = 5;
            stats["Mana"] = 5;
            stats["Luck"] = 5;
        }
    };
}