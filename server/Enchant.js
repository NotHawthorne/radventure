import { StatContainer } from "./StatContainer";


export class Enchant {
    stats = new StatContainer();
    procs = [];
    name = "";
    isPrefix = false;
    level = 0;
    procChance = -1;
    procAbilityId =  0;
    id = 0;
    uuid = 0;

    isProc() { return procChance > 0; }
    copy() {
        ret = new Enchant();
        for (var proc in this.procs) {
            ret.procs.push(proc);
        }
        ret.name = this.name;
        ret.level = this.level;
        ret.procChance = this.procChance;
        ret.procAbilityId = this.procAbilityId;
        return ret;
    }
    become(enchant) {
        this.stats.add(enchant.stats);
        for (var proc in enchant.procs) {
            //am i still using procs?
        }
        this.name = enchant.name;
        this.level = enchant.level;
        this.procChance = -1;
        this.procAbilityId = enchant.procAbilityId;
        this.id = enchant.id;
        this.uuid = enchant.uuid;
    }
    Enchant() { };

    toString() {
        var ret = "{ " +
            "\"name\": \"" + this.name + "\", " +
            "\"isPrefix\": " + this.isPrefix + ", " + 
            "\"stats\": " + this.stats.toString() + ", " + 
            "\"level\": " + this.level + ", " + 
            "\"procChance\": " + this.procChance + ", " + 
            "\"procAbilityId\": " + this.procAbilityId + ", " +
            "\"id\": " + this.id + ", " + 
            "\"uuid\": " + this.uuid + 
            " }";
        return ret;
    }
}

module.exports = Enchant;