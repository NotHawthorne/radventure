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
        while (ret.party_b.length == 0) {
            for (const mob in this.monster_spawns.spawns) {
                if (Math.floor(Math.random() * this.total_weight) <= this.monster_spawns.spawns[mob].weight && ret.party_b.length <= 5) {
                    console.log("HI " + this.monster_spawns.spawns[mob].unit);
                    ret.party_b.push(this.monster_spawns.spawns[mob].unit);
                }
            }
        }
        ret.turn = "a";
        return (ret);
    }

    constructor() {

    }
}