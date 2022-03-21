export class Effect {
    public name: string = null;
    public id: string = null;
    public effectClass: string = null;
    public type: string = null;
    public amtMin: number = null;
    public amtMax: number = null;

    constructor(
        name: string,
        id: string,
        effectClass: string,
        type: string,
        amtMin: number,
        amtMax: number
    ){};

    public getAmt(): number {
        if (this.type == "range")
            return Math.floor(Math.random() * (this.amtMax - this.amtMin) + this.amtMin);
        else if (this.type == "pct" || this.type == "flat")
            return this.amtMin;
        return 0;
    }

    public getProc() {
        if (this.type == "chanceOnHit" || this.type == "proc") {
            return (Math.random() * 100 < this.amtMin);
        } else {
            return (false);
        }
    }
}