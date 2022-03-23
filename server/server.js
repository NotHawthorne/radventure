const Enchant = require('./Enchant.js');
const { Item } = require('./Item.js');
const { Player } = require('./Player.js');
const { Unit } = require('./Unit.js');
const { StatContainer } = require('./StatContainer');
const { Map } = require('./Map.js');
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
const server = require('http').Server(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const oneDay = 1000 * 60 * 60 * 24;

const mapSize = 256;

const encounters = [];

const maps = {};

const dbInit = 0;
const dbLoaded = 0;

const unitBase = {};
const itemBase = {};
const enchantBase = {};
const characters = {};

const itemInstance = {};
const enchantInstance = {};

const players = {};

const inventories = {};

const sockets = {};
const socketRegistry = {};

function loadPlayer(id) {
    console.log("Loading player " + players[id].name + "...");
    socketRegistry[players[id].socket.id] = players[id];
    if (players[id].online == true) {
        console.log("SENDING PLAYER");
        players[id].socket.emit('loginDataDump', JSON.parse(players[id].toString()));
        for (var p in maps[players[id].map_id].players) {
            if (maps[players[id].map_id].players[p].id != id) {
                maps[players[id].map_id].players[p].socket.emit('addPlayer', JSON.parse(players[id].toString()));
                players[id].socket.emit('addPlayer', JSON.parse(maps[players[id].map_id].players[p].toString()));
            }
        }
    } else {
        setTimeout(loadPlayer(id), 250);
    }
}

function initializePlayer(id, socket) {
    if (id in players)
        return ;
    players[id] = new Player();
    players[id].socket = sockets[socket];
    Db.con.query('SELECT * FROM item_instances WHERE owner_id=' + id + ';', function (err, rows, fields) {
        if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
            var ni = new Item();
            ni.become(itemBase[rows[i].base_id]);
            if (rows[i].enchant_key in enchantInstance) {
                for (var enchant in enchantInstance[rows[i].enchant_key]) {
                    ni.enchants.push(enchantInstance[rows[i].enchant_key][enchant]);
                }
            }
            ni.amount = rows[i].amount;
            ni.id = rows[i].id;
            players[id].inventory.push(ni);
            itemInstance[rows[i].id] = ni;
        }
    });
    Db.con.query('SELECT * FROM `character` WHERE owner_id=' + id + ';', function (err, rows, fields) {
        if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
            var u = new Unit();
            u.name = rows[i].name;
            u.uuid = rows[i].id;
            u.level = rows[i].level;
            u.experience = rows[i].experience;
            u.unit_class = rows[i].unit_class;
            u.stats.strength = rows[i].strength;
            u.stats.stamina = rows[i].stamina;
            u.stats.intellect = rows[i].intellect;
            u.stats.wisdom = rows[i].wisdom;
            u.stats.alacrity = rows[i].alacrity;
            u.stats.luck = rows[i].luck;
            u.stats.max_health = rows[i].max_health;
            u.stats.max_mana = rows[i].max_mana;
            u.stats.health = rows[i].health;
            u.stats.mana = rows[i].mana;
            u.stats.health_regen = rows[i].health_regen;
            u.stats.mana_regen = rows[i].mana_regen;
            u.stats.armor = rows[i].armor;
            u.stats.minimum_damage = rows[i].min_damage;
            u.stats.maximum_damage = rows[i].max_damage;
            u.equipment.head = rows[i].head > 0 ? itemInstance[rows[i].head] : null;
            u.equipment.chest = rows[i].chest > 0 ? itemInstance[rows[i].chest] : null;
            u.equipment.shoulders = rows[i].shoulders > 0 ? itemInstance[rows[i].shoulders] : null;
            u.equipment.pants = rows[i].pants > 0 ? itemInstance[rows[i].pants] : null;
            u.equipment.gloves = rows[i].gloves > 0 ? itemInstance[rows[i].gloves] : null;
            u.equipment.feet = rows[i].feet > 0 ? itemInstance[rows[i].feet] : null;
            u.equipment.ring1 = rows[i].ring1 > 0 ? itemInstance[rows[i].ring1] : null;
            u.equipment.ring2 = rows[i].ring2 > 0 ? itemInstance[rows[i].ring2] : null;
            u.equipment.mainhand = rows[i].mainhand > 0 ? itemInstance[rows[i].mainhand] : null;
            u.equipment.offhand = rows[i].offhand > 0 ? itemInstance[rows[i].offhand] : null;
            u.equipment.neck = rows[i].neck > 0 ? itemInstance[rows[i].neck] : null;
            u.equipment.extra_slot0 = rows[i].extra_slot0 > 0 ? itemInstance[rows[i].extra_slot0] : null;
            u.equipment.extra_slot1 = rows[i].extra_slot1 > 0 ? itemInstance[rows[i].extra_slot1] : null;
            players[id].camp.push(u);
            characters[u.uuid] = u;
        }
    });
    Db.con.query('SELECT * FROM player WHERE id=' + id + ';', function (err, rows, fields) {
        for (var i = 0; i < rows.length; i++) {
            players[id].gold = rows[i].gold;
            for (var it = 0; it != 5; it++) {
                if (rows[i]["character"+it] > 0) {
                    players[id].party.push(characters[rows[i]["character"+it]]);
                }
            }
            players[id].map_id = rows[i].map_id;
            players[id].x = rows[i].x;
            players[id].y = rows[i].y;
            players[id].name = rows[i].username;
            players[id].online = true;
            maps[rows[i].map_id].players[id] = players[id];
            loadPlayer(id);
        }
    }.bind(this));
}

function getPlayerInfo(id) {

}


class Db {
    static mysql = require('mysql');
    static con = Db.mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    });
    static initDb() {
        console.log("initializing db...");
        Db.con.query('SELECT * FROM enchant_base', function (err, rows, fields) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                var ne = new Enchant();
                ne.id = rows[i].id;
                ne.name = rows[i].name;
                ne.uuid = 0;
                if (rows[i].effect_class == "statEffect") {
                    ne.stats[rows[i].identifier] = Number(rows[i].amt_max);
                }
                else if (rows[i].effect_class == "procAbility") {
                    ne.procChance = Number(rows[i].amt_max);
                    ne.procAbilityId = Number(rows[i].identifier);
                }
                enchantBase[rows[i].id] = ne;
                console.log(rows[i].effect_class);
            }
            console.log("loaded " + rows.length + " entries from enchant_base");
        });
        Db.con.query('SELECT * FROM enchant_instances', function (err, rows, fields) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                var ne = new Enchant();
                ne.become(enchantBase[rows[i].enchant_base_id]);
                if (!(rows[i].enchant_key in enchantInstance))
                    enchantInstance[rows[i].enchant_key] = [];
                ne.uuid = rows[i].enchant_key;
                enchantInstance[rows[i].enchant_key].push(ne);
                console.log(ne);
            }
            console.log("loaded " + rows.length + " entries from enchant_instance");
        });
        Db.con.query('SELECT * FROM item_base', function (err, rows, fields) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                var ni = new Item();
                ni.name = rows[i].name;
                ni.type = rows[i].type;
                ni.subtype = rows[i].subtype;
                ni.slot = rows[i].slot;
                ni.stats.armor = rows[i].armor;
                ni.stats.minimum_damage = rows[i].min_dmg;
                ni.stats.maximum_damage = rows[i].max_dmg;
                if (rows[i].enchant0 != 0 && rows[i].enchant0 < enchantBase.length())
                    ni.stats.enchant0 = enchantBase[rows[i].enchant0];
                if (rows[i].enchant1 != 0 && rows[i].enchant1 < enchantBase.length())
                    ni.stats.enchant1 = enchantBase[rows[i].enchant1];
                if (rows[i].enchant2 != 0 && rows[i].enchant2 < enchantBase.length())
                    ni.stats.enchant2 = enchantBase[rows[i].enchant2];
                ni.stack_amount = rows[i].stack_amount;
                ni.id = rows[i].id;
                itemBase[rows[i].id] = ni;
            }
            console.log("loaded " + rows.length + " entries from item_base");
        });
        Db.con.query('SELECT * FROM maps', function (err, rows, fields) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                var nm = new Map();
                nm.name = rows[i].name;
                nm.id = rows[i].id;
                nm.players = {};
                nm.monster_spawns = { "spawns": [] };
                nm.total_weight = 0;
                maps[nm.id] = nm;
            }
            console.log("Loaded " + rows.length + " entries from maps db.");
        });
        Db.con.query('SELECT * FROM enemies', function (err, rows, fields) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                var nu = new Unit();
                nu.name = rows[i].name;
                nu.id = rows[i].id;
                nu.level = rows[i].level;
                nu.stats.minimum_damage = rows[i].min_dmg;
                nu.stats.maximum_damage = rows[i].max_dmg;
                nu.stats.armor = rows[i].armor;
                nu.stats.spell_resistance = rows[i].spell_resistance;
                nu.stats.dodge_chance = rows[i].dodge;
                nu.unit_class = nu.name;
                unitBase[rows[i].id] = nu;
            }
            console.log("Loaded " + rows.length + " entries from enemy db.");
        })
        Db.con.query('SELECT * FROM map_spawns', function (err, rows, fields) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                maps[rows[i].map_id].monster_spawns.spawns.push({"id": rows[i].enemy_id, "weight": rows[i].weight, "unit": unitBase[rows[i].enemy_id]});
                maps[rows[i].map_id].total_weight += rows[i].weight;
            }
            console.log('Loaded ' + rows.length + ' map spawn entries.');
        })
        this.dbLoaded = 1;
    }

    static checkLogin(username, password, socket) {
        Db.con.query('SELECT * FROM player WHERE username=\"' + username + "\" AND password=\"" + password + "\";", function (err, rows, fields) {
            if (err) throw err;
            if (rows.length > 0) {
                console.log("Successful login!");
                initializePlayer(rows[0].id, socket);
            }
        });
        console.log("test");
    }
}

function gameTick() {
    if (this.dbInit == 1 && dbLoaded == 0) {
        initDb();
    }
}

function startEncounter(player) {
    console.log(maps[player.map_id].name);
    var enc = maps[player.map_id].genEncounter();
    console.log("!" + enc.toString());
    player.socket.emit('encounterStart', JSON.parse(enc.toString()));
}

setInterval(gameTick, 500);
Db.initDb();

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);



    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        for (var player in players) { // need to call a remove player function on client
            if (players[player].online && players[player].socket.id == socket.id)
                delete players[player];
        }
        delete sockets[socket.id];
    });

    sockets[socket.id] = socket;
    
    socket.on('login', function(data) {
        Db.checkLogin(data.username, data.password, socket.id);
    }.bind(this));

    socket.on('move', function(data) {
        socketRegistry[socket.id].move(data.direction);
        for (var p in maps[socketRegistry[socket.id].map_id].players) {
            maps[socketRegistry[socket.id].map_id].players[p].socket.emit('updatePlayer', JSON.parse(socketRegistry[socket.id].toString()));
        }
        if (Math.floor(Math.random() * 100) >= 10)
            startEncounter(socketRegistry[socket.id]);
        console.log(socketRegistry[socket.id].name + " moved. new loc: " + socketRegistry[socket.id].x + ", " + socketRegistry[socket.id].y);
    }.bind(this));
}.bind(this));

server.listen(4242, function() {
    console.log("Server started!");
})