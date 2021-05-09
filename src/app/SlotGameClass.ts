import * as PIXI from 'pixi.js';
import ReelContainerClass from './ReelContainerClass';

export default class SlotGameClass extends PIXI.Container{

    private paApplication:PIXI.Application;
    private pgTopRegion:PIXI.Graphics; 
    private ptHeaderText:PIXI.Text; 
    private pgButton:PIXI.Graphics;
    private ptPlayText:PIXI.Text; 
    
    private ptsTextStyle:PIXI.TextStyle;  
    
    private XMARGIN:number;
    private YMARGIN:number;
    private SYMBOL_NUM:number;
    private SYMBOL_SIZE:number;

    private nCurrentReel:number;
    private rccReels:ReelContainerClass[];
    
    private bSpinning:boolean;

    constructor(reelsCount:number){
        super();
        this.ptsTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        
        this.SYMBOL_NUM = 3;
        this.SYMBOL_SIZE = 150;
        this.XMARGIN = 50;
        this.YMARGIN = 100;
        this.bSpinning = false;

        this.paApplication = new PIXI.Application({ backgroundColor: 0x1099bb, width: this.XMARGIN*2+this.SYMBOL_SIZE*reelsCount,
            height:this.SYMBOL_SIZE * this.SYMBOL_NUM + this.YMARGIN*2}); 

        this.pgTopRegion = new PIXI.Graphics(); 
        this.pgTopRegion.beginFill(0, 1);
        this.pgTopRegion.drawRect(0, 0, this.paApplication.screen.width, this.YMARGIN);   

        this.ptHeaderText = new PIXI.Text('PIXI MONSTER SLOTS!', this.ptsTextStyle);   
        this.ptHeaderText.x = Math.round((this.paApplication.screen.width - this.ptHeaderText.width) / 2);
        this.ptHeaderText.y = Math.round((this.YMARGIN) / 3);
        this.pgTopRegion.addChild(this.ptHeaderText);

        
        this.paApplication.stage.addChild(this.pgTopRegion);
        
        this.rccReels = [];
        for (let i: number = 0; i < reelsCount; i++) {
            const reel: ReelContainerClass = new ReelContainerClass(i,this.SYMBOL_NUM,this.SYMBOL_SIZE);
            reel.position.set(this.XMARGIN+i*this.SYMBOL_SIZE,this.YMARGIN);
            this.addChild(reel);
            this.paApplication.stage.addChild(reel);
            this.rccReels.push(reel);
            reel.on("spincomplete", this.ReelSpinComplete.bind(this));
        }
        this.nCurrentReel = 0;


        this.pgButton = new PIXI.Graphics();
        this.pgButton.beginFill(0, 1);
        this.pgButton.drawRect(0, this.YMARGIN + this.SYMBOL_SIZE*this.SYMBOL_NUM, this.paApplication.screen.width, this.YMARGIN);   
        this.ptPlayText = new PIXI.Text('Spin the wheels!', this.ptsTextStyle);
        this.ptPlayText.x = Math.round((this.paApplication.screen.width - this.ptPlayText.width) / 2);
        this.ptPlayText.y = this.SYMBOL_SIZE * this.SYMBOL_NUM + this.YMARGIN*5/4;
        this.pgButton.interactive = true;
        this.pgButton.buttonMode = true;
        this.pgButton.addListener('pointerdown', () => {
            this.StartPlay();
        });

        this.pgButton.addChild(this.ptPlayText);
        this.addChild(this.pgButton);
        this.paApplication.stage.addChild(this.pgButton);

        document.body.appendChild(this.paApplication.view); 
        this.paApplication.ticker.add( (delta) => {
            this.Update(delta);            
        });
         
    }

    StartPlay(){
        if (this.bSpinning) {
            return;
        } 
        this.bSpinning = true;
        this.nCurrentReel = 0;
        let timeout: number = 0;
        for (const reel of this.rccReels) {
            setTimeout(reel.SpinReel.bind(reel), timeout);
            timeout += 400;
        }
        setTimeout(this.StopReels.bind(this), timeout);

    }

    public Update(delta: number): void {
        for (const reel of this.rccReels) {
            reel.UpdateReel(delta);
        }
    }

    public StopReels(): void {
        this.rccReels[0].StopReel();
    }

    private ReelSpinComplete(event: Event): void {
        this.nCurrentReel++;
        if (this.nCurrentReel < this.rccReels.length) {
            this.rccReels[this.nCurrentReel].StopReel();
        }
        this.bSpinning = false;
    }

}
