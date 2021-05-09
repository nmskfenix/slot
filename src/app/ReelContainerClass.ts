import * as PIXI from 'pixi.js';
import SymbolsClass from "./SymbolsClass";

export default class ReelContainerClass extends PIXI.Container{

    private nId: number;
    private nSymbolSize: number; 
    private nSymbolsNum: number;
    private scSymbols:SymbolsClass[];
    private pcContainer: PIXI.Container;
    private nTime:number;
    private nTimeStop: number;
    private bSpinning:boolean;
    private bStopping:boolean;
    private pfBlurFilter = new PIXI.filters.BlurFilter();
    private nLimitY:number;
    private nFinalPosition:number;
    private nFinalOffset:number;

    constructor(id:number, symbolsNum:number, symbolSize:number){
        super();
        this.nId = id;
        this.nSymbolsNum = symbolsNum;
        this.nSymbolSize = symbolSize;
        this.pcContainer = new PIXI.Container();
        this.addChild(this.pcContainer);
        this.scSymbols = [];
        this.nTime = 0;
        this.bSpinning = false;
        this.bStopping = false;
        this.nTimeStop = 0;
        this.nFinalPosition = 0;
        this.nFinalOffset = 0;
    
        this.nLimitY = symbolSize*symbolsNum;

        for(let i: number = 0; i < this.nSymbolsNum; i++) {
            const symbol: SymbolsClass = new SymbolsClass(this.nSymbolSize);
            symbol.x = id;
            symbol.y = symbolSize*i;
            this.pcContainer.addChild(symbol);
            this.scSymbols.push(symbol);

        }


    }

    public SpinReel(){
        this.nTime = 0;
        this.bSpinning = true;
        this.pfBlurFilter.blur = 0;
        this.filters = [this.pfBlurFilter];
    }

    public StopReel(){
        this.nFinalOffset = 1;
        this.nFinalPosition = this.nLimitY - this.nSymbolSize - this.scSymbols[0].y;
        this.bStopping = true;
        this.nTimeStop = this.nTime;
    }

    public UpdateReel(delta: number): void {
        
        if (!this.bSpinning) { return; }

        this.nTime += delta;

        const speed: number = this.GetSpeed(delta);
        for (const symbol of this.scSymbols) {
            symbol.y += speed;
        }

        this.pfBlurFilter.blurY = speed * 0.1;

        for (let i: number = this.scSymbols.length - 1; i >= 0; i--) {
            if (this.pcContainer.y + this.scSymbols[i].y> this.nLimitY) {
                this.scSymbols[i].y = this.pcContainer.children[0].y - this.nSymbolSize;
                this.pcContainer.addChildAt(this.scSymbols[i], 0);
                this.scSymbols[i].ChangeType();
            }
        }
        
    }

    public GetId() {
        return this.nId;
    }

    private onComplete(): void {
        this.bStopping = false;
        this.bSpinning = false;
        this.emit("spincomplete", {target: this, id: this.nId});
        this.pfBlurFilter.blur = 0;

    }

    private GetSpeed(delta: number): number {
        let speed: number = delta * 30;

        if (this.bStopping) {
            const nLerp: number = 1 - (this.nTime - this.nTimeStop) / 50;
            const nBack: number = this.Backout(nLerp);
            speed = (this.nFinalOffset - nBack) * this.nFinalPosition;
            this.nFinalOffset = nBack;
            if (nLerp <= 0) { this.onComplete(); }
        } else if (this.nTime < 50) {
            const nLerp: number = this.nTime / 50;
            speed *= this.Backout(nLerp);
        }
        return speed;
    }

    private Backout(amount: number): number {
        return amount * amount * ((amount + 1) * amount - 1);
    }

}