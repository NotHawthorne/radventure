import { StatContainer } from './StatContainer'

export class Unit {
    uuid = -1;
    name = "UNK";
    level = 0;
    stats = new StatContainer();
    owner = "UNK";
    partyId = -1;
    equipment = {};
    effects = [];
    unit_class = "ELF FIGHTER";
    experience = 0;

    toString() {
        var invenStr = "{ "
        var i = 0;
        for (var item in this.equipment) {
            if (i++ > 0) {
                invenStr += ", "
            }
            invenStr += "\"" + item + "\":";
            invenStr += this.equipment[item] != null ? this.equipment[item].toString() : "null";
        }
        invenStr += "}"

        var effectsStr = "[ ";
        for (var effect in this.effects) {
            if (effect > 0)
                effectsStr += ", "
            effectsStr += this.effects[effect].toString();
        }
        effectsStr += "]";

        var ret = "{ " + 
            "\"uuid\": " + this.uuid + ", " +
            "\"name\": \"" + this.name + "\", " + 
            "\"level\": " + this.level + ", " + 
            "\"stats\": " + this.stats.toString() + ", " + 
            "\"owner\": \"" + this.owner + "\", " + 
            "\"partyId\": " + this.partyId + ", " + 
            "\"equipment\": " + invenStr + ", " + 
            "\"effects\": " + effectsStr + ", " + 
            "\"unit_class\": \"" + this.unit_class + "\", " + 
            "\"experience\": " + this.experience + 
            "}";
        console.log("[!]" + ret);
        return ret;
    }

    applyEffect(effect) {
        if (effect != null) {
            if (effect.duration > 0) {
                this.effects.push(effect);
            }
            postMitEffect = new StatContainer();
            postMitEffect.add(effect);
            if (effect.isNegative()) {
                if (effect.health > 0) { // damage
                    if (effect.school == "physical") {
                        postMitEffect.health -= (this.stats.armor / 100);
                    }
                    if (effect.school == "magical") {
                        postMitEffect.health -= this.stats.spell_resistance;
                    }
                    postMitEffect.health -= this.stats.damage_reduction;
                    if (postMitEffect.health < 0) {
                        postMitEffect.health = 0; // dont heal on full resist
                    }
                }
                this.stats.subtract(effect.stats);
            }
            else {
                this.stats.add(effect.stats);
                if (this.stats.health > this.stats.max_health) {
                    this.stats.health = this.stats.max_health; // don't overheal
                }
            }
        } 
    }

    removeEffect(i) {
        if (i < 0 || i > this.effects.length())
            return ;
        if (effects[i].isNegative()) {
            this.stats.add(effects[i].stats);
            this.stats.health -= effects[i].health;
            this.stats.mana -= effects[i].mana;
        }
        else {
            this.stats.subtract(effects[i].stats);
            this.stats.health += effects[i].health;
            this.stats.mana += effects[i].mana;
        }
        this.effects.splice(i, 1);
    }

    tick() {
        for (i = 0; i != this.effects.length(); i++) {
            if (effects[i].duration > 0)
                effects[i].duration -= 1;
            if (this.isNegative)
                this.stats.subtract(effects[i].stats);
            else
                this.stats.add(effects[i].stats);
            if (effects[i].duration == 0)
                this.removeEffect(i);
        }
    }
}