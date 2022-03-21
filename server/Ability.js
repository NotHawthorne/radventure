export class Ability {
    id = 0;
    effects = [];
    cost = 0;
    costType = "none"; // mana, energy, etc
    targetUnits = "all"; // all, self, allies, enemies
    targetType = "single"; // single, aoe
    school = "physical" // physical, magical, none

    canTarget(caster, target) {
        switch (targetUnits) {
            case "self":
                if (caster.uuid != target.uuid)
                    return false;
                break ;
            case "allies":
                if ((caster.partyId != -1 && caster.partyId != target.partyId) || caster.owner != target.owner)
                    return false;
                break ;
            case "enemies":
                if ((caster.partyId != -1 && caster.partyId == target.partyId) || caster.owner == target.owner)
                    return false;
                break ;
        }
    }

    canCast(caster) {
        switch (costType) {
            case "mana":
                if (caster.stats.mana < this.cost)
                    return false;
                    break ;
            default:
                return true;
                break ;
        }
    }
}