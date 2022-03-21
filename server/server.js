const Enchant = require('./Enchant.js');
const { Item } = require('./Item.js');
const { Player } = require('./Player.js');
const { Unit } = require('./Unit.js');
const { StatContainer } = require('./StatContainer');
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

const enemyBase = {};
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
        players[id].socket.emit('loginDataDump', JSON.parse(players[id].toString()));
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
                    ni.enchants.push(enchant);
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
            if (rows[i].head > 0)
                u.equipment.head = itemInstance[rows[i].head];
            if (rows[i].shoulders > 0)
                u.equipment.shoulders = itemInstance[rows[i].shoulders];
            if (rows[i].chest > 0)
                u.equipment.chest = itemInstance[rows[i].chest];
            if (rows[i].pants > 0)
                u.equipment.pants = itemInstance[rows[i].pants];
            if (rows[i].gloves > 0)
                u.equipment.gloves = itemInstance[rows[i].gloves];
            if (rows[i].feet > 0)
                u.equipment.feet = itemInstance[rows[i].feet];
            if (rows[i].ring1 > 0)
                u.equipment.ring1 = itemInstance[rows[i].ring1];
            if (rows[i].ring2 > 0)
                u.equipment.ring2 = itemInstance[rows[i].ring2];
            if (rows[i].mainhand > 0)
                u.equipment.mainhand = itemInstance[rows[i].mainhand];
            if (rows[i].offhand > 0)
                u.equipment.offhand = itemInstance[rows[i].offhand];
            if (rows[i].neck > 0)
                u.equipment.neck = itemInstance[rows[i].neck];
            if (rows[i].extra_slot0)
                u.equipment.extra_slot0 = itemInstance[rows[i].extra_slot0];
            if (rows[i].extra_slot1)
                u.equipment.extra_slot1 = itemInstance[rows[i].extra_slot1];
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
            players[id].name = rows[i].username;
            console.log("Initialized2 " + players[id].name);
            players[id].online = true;
            loadPlayer(id);
        }
    }.bind(this));
}

function getPlayerInfo(id) {

}


function generateEncounter() {

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
                if (rows[i].effectClass == "statEffect") {
                    ne.stats[rows[i].identifier] += rows[i].amt_max;
                }
                else if (rows[i].effectClass == "procAbility") {
                    ne.procChance = rows[i].amt_max;
                    ne.procAbilityId = rows[i].identifier;
                }
                enchantBase[rows[i].id] = ne;
            }
            console.log("loaded " + rows.length + " entries from enchant_base");
        });
        Db.con.query('SELECT * FROM enchant_instances', function (err, rows, fields) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                var ne = new Enchant(enchantBase[rows[i].enchant_base_id]);
                if (!(rows[i].enchant_key in enchantInstance))
                    enchantInstance[rows[i].enchant_key] = [];
                ne.uuid = rows[i].id;
                enchantInstance[rows[i].enchant_key] = ne;
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
                maps[nm.id] = nm;
            }
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

setInterval(gameTick, 500);
Db.initDb();

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);



    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        for (var player in players) {
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
        console.log(socketRegistry[socket.id].name + " moved. new loc: " + socketRegistry[socket.id].x + ", " + socketRegistry[socket.id].y);
    }.bind(this));
}.bind(this));

server.listen(4242, function() {
    console.log("Server started!");
})