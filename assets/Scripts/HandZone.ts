// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CardZone from './CardZone';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HandZone extends cc.Component {

  @property(cc.Node)
  battleZone: cc.Node = null;

  @property(cc.Node)
  cardZone: CardZone = null

  @property(cc.Boolean)
  isOpponent: boolean = true

  cards: cc.Node[] = [];

  currentCardAtr: CardAtribute = new CardAtribute()
  handZonePos: HandZonePos = new HandZonePos()

  onLoad() {
    const cardRange = (this.cards.length - 1) / 2
    let cardIndexs = this.range(-cardRange, cardRange, 1)

    this.handZonePos.minX = -this.node.width / 2
    this.handZonePos.maxX = this.node.width / 2
    this.handZonePos.minY = -this.node.height / 2
    this.handZonePos.maxY = this.node.height / 2

    this.cards.forEach((node, index) => {
      const x = cardIndexs[index] * 100 * Math.min(5 / cardRange, 1)
      const y = Math.abs(cardIndexs[index]) * -10 * Math.min(5 / cardRange, 1)
      node.setPosition(x, -230, index)
      node.setScale(0.7, 0.7)
      node.angle = -(cardIndexs[index] * 4)
      this.isOpponent ? '' : node.getChildByName("CardManaIcon").getComponent("ShowUp").isShow = true
      this.node.addChild(node)
      setTimeout(() => {
        cc.tween(node)
          .to(0.6, { position: cc.v3(x, y + 40, index) }, { easing: 'quadInOut' })
          .to(0.2, { position: cc.v3(x, y, index) }, { easing: 'quadInOut' })
          .start()
      }, 100 * index)

      this.isOpponent ? '' : node.on(cc.Node.EventType.TOUCH_START, this.scaleUp, this)
      this.isOpponent ? '' : node.on(cc.Node.EventType.TOUCH_END, this.scaleDown, this)
    })
  }

  addNewCard(card: cc.Node) {
    this.cards.push(card)

    const cardRange = (this.cards.length - 1) / 2
    let cardIndexs = this.range(-cardRange, cardRange, 1)
    const index = cardIndexs.length - 1

    const x = cardIndexs[index] * 100 * Math.min(5 / cardRange, 1)
    const y = Math.abs(cardIndexs[index]) * -10 * Math.min(5 / cardRange, 1)

    card.setPosition(x, -230, index)
    card.setScale(0.7, 0.7)
    this.isOpponent ? '' : card.getChildByName("CardManaIcon").getComponent("ShowUp").isShow = true

    this.isOpponent ? '' : card.on(cc.Node.EventType.TOUCH_START, this.scaleUp, this)
    this.isOpponent ? '' : card.on(cc.Node.EventType.TOUCH_END, this.scaleDown, this)
    this.node.addChild(card)

  }

  reSoftCard() {
    const cardRange = (this.cards.length - 1) / 2
    let cardIndexs = this.range(-cardRange, cardRange, 1)
    this.cards.forEach((node, index) => {
      const x = cardIndexs[index] * 100 * Math.min(5 / cardRange, 1)
      const y = Math.abs(cardIndexs[index]) * -10 * Math.min(5 / cardRange, 1)
      cc.tween(node)
        .to(0.2, { x: x, y: y, z: index, zIndex: index, angle: -(cardIndexs[index] * 4) }, { easing: 'quadInOut' })
        .start()
    })
  }

  scaleUp(event: cc.Event.EventMouse) {
    const node = event.currentTarget
    this.currentCardAtr.angle = node.angle
    this.currentCardAtr.x = node.x
    this.currentCardAtr.y = node.y
    node.off(cc.Node.EventType.TOUCH_MOVE, this.moveCard, this)
    cc.tween(node)
      .to(0.05, { y: this.currentCardAtr.y <= 0 ? 40 : node.y, scale: 1, zIndex: 100, angle: 0 }, { easing: 'quadInOut' })
      .start();
    this.isOpponent ? '' : node.on(cc.Node.EventType.TOUCH_END, this.scaleDown, this)
    this.isOpponent ? '' : node.on(cc.Node.EventType.TOUCH_MOVE, this.moveCard, this)
  }

  scaleDown(event: cc.Event.EventMouse) {
    const node = event.currentTarget
    cc.tween(node)
      .to(0.1, { y: this.currentCardAtr.y, scale: 0.7, zIndex: node.z, angle: this.currentCardAtr.angle }, { easing: 'quadInOut' })
      .start();
    this.unChooseCard(event)
  }

  unChooseCard(event: cc.Event.EventMouse) {
    const node = event.currentTarget
    if (
      node.x < this.handZonePos.minX ||
      node.x > this.handZonePos.maxX ||
      node.y < this.handZonePos.minY ||
      node.y > this.handZonePos.maxY
    ) {
      // go to battle zone
      cc.log('go to battle zone')
      this.battleZone.getComponent("BattleZone").addToCard(cc.instantiate(node), this.node.y)
      this.battleZone.getComponent("BattleZone").reSoftCard()
      this.cards = this.cards.filter(item => item.name !== node.name)
      node.destroy()
      this.cardZone.getComponent("CardZone").addNewCard()
      setTimeout(() => {
        this.reSoftCard()
      }, 500)

    } else {
      // return to hand zone
      cc.log('return to hand zone')
      cc.tween(node)
        .to(0.1, { scale: 0.7 }, { easing: 'quadInOut' })
        .start();
      node.off(cc.Node.EventType.TOUCH_END, this.scaleDown, this)
    }
    this.reSoftCard()
    node.off(cc.Node.EventType.TOUCH_MOVE, this.moveCard, this)
  }

  moveCard(event: cc.Event.EventMouse) {
    const x = event.currentTarget.x + event.getDeltaX()
    const y = event.currentTarget.y + event.getDeltaY()
    this.currentCardAtr.angle = 0
    this.currentCardAtr.x = x
    this.currentCardAtr.y = y
    event.currentTarget.setPosition(x, y, 0)
  }

  range(start: number, stop: number, step: number) {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
  }

  start() {
  }

  // update (dt) {}
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

class HandZonePos {
  minX: number = 0
  minY: number = 0
  maxX: number = 0
  maxY: number = 0

  constructor(init?: Partial<HandZonePos>) {
    Object.assign(this, init)
  }
}