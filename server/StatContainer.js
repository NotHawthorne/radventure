export class StatContainer {
    strength = 0;
    stamina = 0;
    intellect = 0;
    wisdom = 0;
    alacrity = 0;
    luck = 0;
    weapon_damage = 0;
    spell_damage = 0;
    bonus_healing = 0;
    damage_reduction = 0;
    spell_resistance = 0;
    dodge_chance = 0;
    parry_chance = 0;
    block_chance = 0;
    crit_chance = 0;
    hit_chance = 0;
    health = 0;
    health_regen = 0;
    mana = 0;
    mana_regen = 0;
    magic_find = 0;
    gold_find = 0;
    life_on_hit = 0;
    minimum_damage = 0;
    maximum_damage = 0;
    armor = 0;
    max_health = 0;
    max_mana = 0;

    StatContainer() { }

    subtract(s) {
        this.strength -= s.strength;
        this.stamina -= s.stamina;
        this.intellect -= s.intellect;
        this.wisdom -= s.wisdom;
        this.alacrity -= s.alacrity;
        this.luck -= s.luck;
        this.weapon_damage -= s.weapon_damage;
        this.spell_damage -= s.spell_damage;
        this.bonus_healing -= s.bonus_healing;
        this.damage_reduction -= s.damage_reduction;
        this.spell_resistance -= s.spell_resistance;
        this.dodge_chance -= s.dodge_chance;
        this.parry_chance -= s.parry_chance;
        this.block_chance -= s.block_chance;
        this.crit_chance -= s.crit_chance;
        this.hit_chance -= s.hit_chance;
        this.health -= s.health;
        this.health_regen -= s.health_regen;
        this.mana -= s.mana;
        this.mana_regen -= s.mana_regen;
        this.magic_find -= s.magic_find;
        this.gold_find -= s.gold_find;
        this.life_on_hit -= s.life_on_hit;
        this.minimum_damage -= s.minimum_damage;
        this.maximum_damage -= s.maximum_damage;
        this.armor -= s.armor;
        this.max_health -= s.max_health;
        this.max_mana -= s.max_mana;
    }

    add(s) {
        this.strength += s.strength;
        this.stamina += s.stamina;
        this.intellect += s.intellect;
        this.wisdom += s.wisdom;
        this.alacrity += s.alacrity;
        this.luck += s.luck;
        this.weapon_damage += s.weapon_damage;
        this.spell_damage += s.spell_damage;
        this.bonus_healing += s.bonus_healing;
        this.damage_reduction += s.damage_reduction;
        this.spell_resistance += s.spell_resistance;
        this.dodge_chance += s.dodge_chance;
        this.parry_chance += s.parry_chance;
        this.block_chance += s.block_chance;
        this.crit_chance += s.crit_chance;
        this.hit_chance += s.hit_chance;
        this.health += s.health;
        this.health_regen += s.health_regen;
        this.mana += s.mana;
        this.mana_regen += s.mana_regen;
        this.magic_find += s.magic_find;
        this.gold_find += s.gold_find;
        this.life_on_hit += s.life_on_hit;
        this.minimum_damage += s.minimum_damage;
        this.maximum_damage += s.maximum_damage;
        this.armor += s.armor;
        this.max_health += s.max_health;
        this.max_mana += s.max_mana;
    }

    toString() {
        var ret = "{ ";
        ret += "\"strength\":" + this.strength + ", ";
        ret += "\"stamina\":" + this.stamina + ", ";
        ret += "\"intellect\": " + this.intellect+ ", ";
        ret += "\"wisdom\":" + this.wisdom + ", ";
        ret += "\"alacrity\": " + this.alacrity+ ", ";
        ret += "\"luck\": " + this.luck + ", ";
        ret += "\"weapon_damage\": " + this.weapon_damage + ", ";
        ret += "\"spell_damage\": " + this.spell_damage + ", ";
        ret += "\"spell_damage\": " + this.spell_damage+ ", ";
        ret += "\"damage_reduction\": " + this.damage_reduction + ", ";
        ret += "\"spell_resistance\": " + this.spell_resistance + ", ";
        ret += "\"dodge_chance\": " + this.dodge_chance + ", ";
        ret += "\"parry_chance\": " + this.parry_chance + ", ";
        ret += "\"block_chance\": " + this.block_chance + ", ";
        ret += "\"crit_chance\": " + this.crit_chance + ", ";
        ret += "\"hit_chance\": " + this.hit_chance + ", ";
        ret += "\"health\": " + this.health + ", ";
        ret += "\"health_regen\": " + this.health_regen + ", ";
        ret += "\"mana\": " + this.mana + ", ";
        ret += "\"mana_regen\": " + this.mana_regen + ", ";
        ret += "\"magic_find\": " + this.magic_find + ", ";
        ret += "\"gold_find\": " + this.gold_find + ", ";
        ret += "\"life_on_hit\": " + this.life_on_hit + ", ";
        ret += "\"minimum_damage\": " + this.minimum_damage + ", ";
        ret += "\"maximum_damage\": " + this.maximum_damage + ", ";
        ret += "\"armor\": " + this.armor + ", ";
        ret += "\"max_health\": " + this.max_health + ", ";
        ret += "\"max_mana\": " + this.max_mana;
        ret += " }"
        return ret;
    }
}