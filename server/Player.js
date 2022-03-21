export class Player {
    name = "Unknown";
    inventory = [];
    party = [];
    camp = [];
    bank = [];
    gold = 0;
    adamant = 0;
    mithryll = 0;
    x = 0;
    y = 0;
    map_id = 0;
    online = false;
    socket = null;
    acl_level = 0;

    move(direction) {
        if (direction == "up" && this.y > 0)
            this.y--;
        if (direction == "down" && this.y < 400)
            this.y++;
        if (direction == "left" && this.x > 0)
            this.x--;
        if (direction == "right" && this.x < 400)
            this.x++;
    }
    
    toString() {
        var inventoryString = "[ ";
        for (var item in this.inventory) {
            if (item > 0)
                inventoryString += ", ";
            inventoryString += this.inventory[item].toString();
        }
        inventoryString += "] ";
        console.log(inventoryString);

        var charactersString = "[ ";
        for (var character in this.party) {
            if (character > 0)
                charactersString += ", ";
            charactersString += this.party[character].toString();
        }
        charactersString += "] ";

        var campString = "[ ";
        for (var character in this.camp) {
            if (character > 0)
                campString += ", ";
            campString += this.camp[character].toString();
        }
        campString += "]";

        var bankString = "[ ";
        for (var item in this.bank) {
            if (item > 0)
                bankString += ", ";
            bankString += this.bank[item].toString();
        }
        bankString += "] "

        var ret = "{ " +
            "\"name\": \"" + this.name + "\", " + 
            "\"inventory\": " + inventoryString + ", " + 
            "\"party\": " + charactersString + ", " + 
            "\"camp\": " + campString + ", " + 
            "\"bank\": " + bankString + ", " + 
            "\"gold\": " + this.gold + ", " + 
            "\"adamant\": " + this.adamant + ", " + 
            "\"mithryll\": " + this.mithryll + ", " + 
            "\"x\": " + this.x + ", " + 
            "\"y\": " + this.y + ", " + 
            "\"map_id\": " + this.map_id + ", " +
            "\"online\":" + this.online + ", " +
            "\"acl_level\":" + this.acl_level +
            "}";
        return ret;
    }
}