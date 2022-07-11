// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HandZone from './HandZone';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardTouchEvent extends cc.Component {

  @property(cc.Prefab)
  chooseArrow: cc.Prefab = null
  currentArrow: cc.Node = null

  @property(cc.Prefab)
  cardBorderGlow: cc.Prefab = null

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

  onCollisionExit(otherCollider: cc.BoxCollider, selfCollider: cc.BoxCollider) {
    this.isEnterBatteZone = false
  }

  scaleUp(event: cc.Event.EventTouch) {
    //enable collider
    this.manager.enabled = true;

    //scale card up
    const node = event.currentTarget
    this.currentCardAtr.angle = node.angle
    this.currentCardAtr.x = node.x
    this.currentCardAtr.y = node.y
    node.off(cc.Node.EventType.TOUCH_MOVE, this.moveCard, this)
    cc.tween(node)
      .to(0.05, { y: this.currentCardAtr.y <= 0 ? 40 : node.y, scale: 1, zIndex: 100, angle: 0 }, { easing: 'quadInOut' })
      .start();
    this.node.on(cc.Node.EventType.TOUCH_END, this.scaleDown, this)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.scaleDown, this)
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveCard, this)
  }

  scaleDown() {
    if (this.isEnterBatteZone) {
      //disanable collider
      this.manager.enabled = false;

      //move card to battle zone
      this.handZone.goToBattleZone(this.node)

      //turn off touch event
      this.node.off(cc.Node.EventType.TOUCH_START)
      this.node.off(cc.Node.EventType.TOUCH_END)
      this.node.off(cc.Node.EventType.TOUCH_CANCEL)
      this.node.off(cc.Node.EventType.TOUCH_MOVE)

      //new event for card in battle zonesdasdaasd
      this.node.on(cc.Node.EventType.TOUCH_START, this.showArrow, this)
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.controlArrow, this)
      this.node.on(cc.Node.EventType.TOUCH_END, this.removeArrow, this)
      this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.removeArrow, this)
    } else {
      this.handZone.reSoftCard()
    }
    cc.tween(this.node)
      .to(0.1, { scale: 0.7 }, { easing: 'quadInOut' })
      .start();

  }

  showArrow(event: cc.Event.EventTouch) {
    //add card glow
    const cardGlow = cc.instantiate(this.cardBorderGlow)
    cardGlow.setPosition(0, 0)
    this.node.addChild(cardGlow)

    //add arrow
    const arrow = cc.instantiate(this.chooseArrow)
    const nodeSpace = (this.node.convertTouchToNodeSpaceAR(event.touch))
    arrow.setPosition(nodeSpace.x, nodeSpace.y)
    arrow.zIndex = -1
    this.currentArrow = arrow
    this.node.addChild(arrow)
  }

  removeArrow(event: cc.Event.EventTouch) {
    //remove card glow
    this.node.getChildByName("CardBorderGlow")?.destroy()

    //remove card glow
    this.currentArrow.destroy()
  }

  controlArrow(event: cc.Event.EventTouch) {
    //get current x,y
    const nodeSpace = (this.node.convertTouchToNodeSpaceAR(event.touch))
    let x = nodeSpace.x
    let y = nodeSpace.y

    //set caculate and set angle for arrow
    const firstAngle = Math.atan2(1, 0);
    const secondAngle = Math.atan2(y, x);
    let angle = secondAngle - firstAngle;
    angle = angle * 180 / Math.PI;
    this.currentArrow.angle = angle

    //set posotion for arrow
    const isOutOfHeight = Math.pow(this.currentArrow.height, 2) <= Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2)

    if (isOutOfHeight) {
      const xm = nodeSpace.x < 0 ? -1 : 1
      const ym = nodeSpace.y < 0 ? -1 : 1

      x = xm * Math.abs(Math.sin(angle * Math.PI / 180) * this.currentArrow.height);
      y = ym * Math.abs(Math.cos(angle * Math.PI / 180) * this.currentArrow.height);
    }
    this.currentArrow.setPosition(x, y)
  }

  moveCard(event: cc.Event.EventTouch) {
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