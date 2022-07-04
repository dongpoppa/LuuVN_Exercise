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

  onLoad() {
    const cardRange = (this.cards.length - 1) / 2
    let cardIndexs = this.range(-cardRange, cardRange, 1)

    this.cards.forEach((node, index) => {
      const x = cardIndexs[index] * 100 * Math.min(5 / cardRange, 1)
      const y = Math.abs(cardIndexs[index]) * -10 * Math.min(5 / cardRange, 1)
      node.setPosition(x, -230, index)
      node.setScale(0.7, 0.7)
      node.angle = -(cardIndexs[index] * 4)
      this.isOpponent ? '' : node.getChildByName("CardManaIcon").getComponent("ShowUp").isShow = true
      this.isOpponent ? '' : node.getComponent("CardTouchEvent").handZone = this
      this.node.addChild(node)
      setTimeout(() => {
        cc.tween(node)
          .to(0.6, { position: cc.v3(x, y + 40, index) }, { easing: 'quadInOut' })
          .to(0.2, { position: cc.v3(x, y, index) }, { easing: 'quadInOut' })
          .start()
      }, 100 * index)

    })
  }

  addNewCard(card: cc.Node) {
    this.cards.push(card)

    const cardRange = (this.cards.length - 1) / 2
    let cardIndexs = this.range(-cardRange, cardRange, 1)
    const index = cardIndexs.length - 1

    const x = cardIndexs[index] * 100 * Math.min(5 / cardRange, 1)

    card.setPosition(x, -230, index)
    card.setScale(0.7, 0.7)
    this.isOpponent ? '' : card.getChildByName("CardManaIcon").getComponent("ShowUp").isShow = true
    this.isOpponent ? '' : card.getComponent("CardTouchEvent").handZone = this
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

  goToBattleZone(node: cc.Node) {
    cc.log('go to battle zone')
    this.node.removeChild(node)
    this.cards = this.cards.filter(item => item.name !== node.name)
    this.battleZone.getComponent("BattleZone").addToCard(node, this.node.y)
    this.cardZone.getComponent("CardZone").addNewCard()
    setTimeout(() => {
      this.reSoftCard()
    }, 500)
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