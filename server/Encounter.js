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

    toString() {
        var party_a_string = "[ ";
        for (const member in this.party_a) {
            if (member > 0) {
                party_a_string += ", ";
            }
            party_a_string += this.party_a[member].toString();
        }
        party_a_string += "] ";
        var party_b_string = "[ ";
        for (const member in this.party_b) {
            if (member > 0) {
                party_b_string += ", ";
            }
            console.log(this.party_b[member].name);
            party_b_string += this.party_b[member].toString();
            console.log(JSON.stringify(this.party_b[member]));
        }
        party_b_string += " ] ";
        var ret = "{ " +
            "\"party_a\":" + party_a_string + ", " +
            "\"party_b\":" + party_b_string + ", " +
            "\"turn\":\"" + this.turn + "\"" +
            "} ";
        return ret;
    }
}