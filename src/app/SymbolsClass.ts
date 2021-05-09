import * as PIXI from 'pixi.js';

export default class SymbolsClass extends PIXI.Container{

    private nSymbolSize: number;
    private nSymbolType: number;
    private ptSlotTextures:PIXI.Texture[];
    private psSprite: PIXI.Sprite;

    constructor(symbolSize:number){
        super();
        this.nSymbolSize = symbolSize;
        this.ptSlotTextures = [];
        this.nSymbolType = 0;
        this.ptSlotTextures.push((PIXI.Texture.from("assets/images/eggHead.png")));
        this.ptSlotTextures.push(PIXI.Texture.from("assets/images/flowerTop.png"));
        this.ptSlotTextures.push(PIXI.Texture.from("assets/images/helmlok.png"));
        this.ptSlotTextures.push(PIXI.Texture.from("assets/images/skully.png"));

        this.psSprite = new PIXI.Sprite();
        this.psSprite.height = this.nSymbolSize;
        this.psSprite.width = this.nSymbolSize;        
        this.addChild(this.psSprite);    
        this.ChangeType();
    }

    public ChangeType()
    {
        this.nSymbolType = Math.floor(Math.random() * this.ptSlotTextures.length);
        this.psSprite.texture = this.ptSlotTextures[this.nSymbolType];               
    }

}
