export class Encounter {
    party_a = [];
    party_b = [];
    turn = "a";
    actions = [];

    evaluateActions() {
        for (const action in this.actions) {
            if (action.isValid() && action.ability.canTarget(action.owner, action.target) && action.ability.canCast(action.owner)) {
                for (const effect in action.effects) {
                    action.target.applyEffect(effect);
                }
                switch(action.ability.costType) {
                    case "mana":
                        action.owner.stats.mana -= action.ability.cost;
                        break ;
                }
            }
        }
        this.actions = [];
    }

    Encounter(a, b) {
        for (const member in a) {
            this.party_a.push(member);
        }
        for (const member in b) {
            this.party_b.push(member);
        }
    }
}