// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HandZone from './HandZone';

const { ccclass } = cc._decorator;

@ccclass
export default class CardTouchEvent extends cc.Component {

  currentCardAtr: CardAtribute = new CardAtribute()
  handZone: HandZone = null;
  isEnterBatteZone: boolean = false;

  manager = cc.director.getCollisionManager();

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.scaleUp, this)
    this.node.on(cc.Node.EventType.TOUCH_END, this.scaleDown, this)
  }

  onCollisionEnter(otherCollider: cc.BoxCollider, selfCollider: cc.BoxCollider) {
    if (selfCollider.node.name === this.node.name && otherCollider.node.name === "BattleZone") {
      this.isEnterBatteZone = true
    }
  }

  // onCollisionStay(otherCollider: cc.BoxCollider, selfCollider: cc.BoxCollider) {
  //   console.log("stay")
  //   if (selfCollider.node.name === this.node.name && otherCollider.node.name === "BattleZone") {
  //     this.isEnterBatteZone = true
  //   }
  // }

  onCollisionExit(otherCollider: cc.BoxCollider, selfCollider: cc.BoxCollider) {
    this.isEnterBatteZone = false
    console.log("exit")
  }

  scaleUp(event: cc.Event.EventMouse) {
    this.manager.enabledDebugDraw = true;
    this.manager.enabled = true;
    const node = event.currentTarget
    this.currentCardAtr.angle = node.angle
    this.currentCardAtr.x = node.x
    this.currentCardAtr.y = node.y
    node.off(cc.Node.EventType.TOUCH_MOVE, this.moveCard, this)
    cc.tween(node)
      .to(0.05, { y: this.currentCardAtr.y <= 0 ? 40 : node.y, scale: 1, zIndex: 100, angle: 0 }, { easing: 'quadInOut' })
      .start();
    this.node.on(cc.Node.EventType.TOUCH_END, this.scaleDown, this)
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveCard, this)
  }

  scaleDown() {
    if (this.isEnterBatteZone) {
      this.manager.enabledDebugDraw = false;
      this.manager.enabled = false;
      this.handZone.goToBattleZone(this.node)
      this.node.off(cc.Node.EventType.TOUCH_START)
      this.node.off(cc.Node.EventType.TOUCH_END)
      this.node.off(cc.Node.EventType.TOUCH_MOVE)
    } else {
      this.handZone.reSoftCard()
    }
    cc.tween(this.node)
      .to(0.1, { scale: 0.7 }, { easing: 'quadInOut' })
      .start();

  }

  moveCard(event: cc.Event.EventMouse) {
    const x = event.currentTarget.x + event.getDeltaX()
    const y = event.currentTarget.y + event.getDeltaY()
    this.currentCardAtr.angle = 0
    this.currentCardAtr.x = x
    this.currentCardAtr.y = y
    event.currentTarget.setPosition(x, y, 0)
  }
}

class CardAtribute {
  angle: number = 0;
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(init?: Partial<CardAtribute>) {
    Object.assign(this, init)
  }
}