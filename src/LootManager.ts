import { Item } from "./Item";

const itemData = require("../data/itemData.json");
const itemTraitData = require("../data/itemTraitData.json");
const items = require("../data/items.json");

export class LootManager {
    public static getItemById(id: number) { return items["items"][id]; }

    public static getRandomItem(level: number) {
        var lootTable = items["items"].filter(item => item["level"] < level);
        return (lootTable[Math.floor(Math.random() * lootTable.length())]);
    }

    public static generateLoot(level: number, magicFind: number, goldFind: number) {
        var ret = {};
        ret["gold"] = Math.floor((Math.random() * (level * 5)) + (Math.random() * goldFind));
        ret["items"] = [];
        var lootChance = 0.5 + (level / 5) + (magicFind / 5);
        while ((Math.random() * 100) < lootChance) {
            var randomBase = LootManager.getRandomItem(level);
            var newItem = new Item(randomBase["name"], randomBase["type"], randomBase["subtype"], randomBase["slot"], randomBase["level"], randomBase["effects"]);
            ret["items"].push(newItem);
            lootChance /= 2;
        }
        return ret;
    }
}