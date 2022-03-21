import { StatContainer } from './StatContainer';

export class Item {
    id = 0;
    name = "UNK";
    type = "Misc";
    subtype = "none";
    slot = "none"
    stats = new StatContainer();
    enchants = [];
    amount = 1;
    stack_amount = 1;

    become(item) {
        this.name = item.name;
        this.type = item.type;
        this.subtype = item.subtype;
        this.slot = item.slot;
        this.stats.add(item.stats);
        for (var enchant in item.enchants) {
            this.enchants.push(enchant.copy());
        }
    }

    Item() { }

    toString() {
        var enchantStr = "[ ";
        for (enchant in this.enchants) {
            enchantStr += enchant.toString() + ", ";
        }
        enchantStr += "] "
        var ret = "{ " + 
            "\"id\": " + this.id + ", " + 
            "\"name\": \"" + this.name + "\", " + 
            "\"type\": \"" + this.type + "\", " + 
            "\"subtype\": \"" + this.subtype + "\", " +
            "\"slot\": \"" + this.slot + "\", " + 
            "\"stats\": " + this.stats.toString() + ", " + 
            "\"enchants\": " + enchantStr + ", " + 
            "\"amount\": " + this.amount + ", " + 
            "\"stack_amount\": " + this.stack_amount + + "" +
            "}";
        return ret;
    }
}