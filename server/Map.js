const { Encounter } = require('./Encounter.js');

export class Map {
    id = 0;
    monster_spawns = {
        spawns: []
    };
    players = {};
    entities = [];
    name = "UNK";
    total_weight = 0;

    genEncounter() {
        var ret = new Encounter();
        ret.party_a = [];
        ret.party_b = [];
        var init_total_weight = (this.total_weight * 2);
        while (ret.party_b.length == 0 && ret.party_b.length < 5) {
            for (const mob in this.monster_spawns.spawns) {
                var roll = Math.random() * init_total_weight;
                while (roll > this.monster_spawns.spawns[mob].weight && ret.party_b.length < 5) {
                    ret.party_b.push(this.monster_spawns.spawns[mob].unit);
                    roll /= 2;
                }
            }
        }
        ret.turn = "a";
        return (ret);
    }

    constructor() {

    }
}