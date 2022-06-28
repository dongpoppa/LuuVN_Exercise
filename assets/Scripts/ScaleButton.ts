// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScaleButton extends cc.Component {

  @property(cc.String)
  color: string = '#ffffff'

  @property(cc.Float)
  scale: number = 1

  @property(cc.Node)
  target: cc.Node = null

  protected onLoad(): void {
    if(!this.target) {
      this.target = this.node
    }
  }

  start() {
    //Given that you've already created a sprite called mySprite:
    this.node.on(cc.Node.EventType.MOUSE_ENTER, this.scaleUp, this);
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.scaleDown, this);
  }

  scaleUp() {
    cc.tween(this.target)
      .to(0.1, { scale: this.scale, color: cc.Color.fromHEX(cc.Color.WHITE, this.color) }, { easing: 'quadInOut' })
      .start();
  }

  scaleDown() {
    cc.tween(this.target)
      .to(0.1, { scale: 1, color: cc.Color.WHITE }, { easing: 'quadInOut' })
      .start();
  }
  // update (dt) {}
}
