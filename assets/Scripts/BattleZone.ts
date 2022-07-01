// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator;

@ccclass
export default class BattleZone extends cc.Component {

  cards: cc.Node[] = [];

  destroyCard: cc.Node[] = []

  destroyCardX = -735
  destroyCardY = 3

  addToCard(card: cc.Node, handZoneNodeY: number) {
    card.getChildByName("CardManaIcon").getComponent("ShowUp").isShow = false
    this.node.addChild(card)
    card.setPosition(card.x, card.y - (this.node.y - handZoneNodeY))
    this.cards.push(card)
  }

  reSoftCard() {
    if (this.cards.length > 5) {
      this.destroyCard.push(this.cards.shift())
      if (this.destroyCard.length > 5) this.destroyCard.shift();

      this.destroyCard.forEach((node, index) => {
        const destroyCardX = this.destroyCardX - (4 * index)
        const destroyCardY = this.destroyCardY + (4 * index)

        if (index === 4 || this.destroyCard.length <= 5) {
          cc.tween(node)
            .to(0.5, { x: destroyCardX, y: destroyCardY, scaleX: 0.74, scaleY: 0.5, skewX: 21 }, { easing: 'quadInOut' })
            .call(() => {
              if (index < this.destroyCard.length - 1) {
                node.getChildByName("Creature")?.destroy()
              }
            })
            .start()
        } else {
          cc.tween(node)
            .to(0.5, { x: destroyCardX, y: destroyCardY }, { easing: 'quadInOut' })
            .start()
        }
      })
    }
    const cardRange = (this.cards.length - 1) / 2
    let cardIndexs = this.range(-cardRange, cardRange, 1)

    this.cards.forEach((node, index) => {
      const x = cardIndexs[index] * -(800 / this.cards.length)
      cc.tween(node)
        .to(0.5, { x: -x, y: 0 }, { easing: 'quadInOut' })
        .to(0.2, { scale: 0.7 }, { easing: 'quadInOut' })
        .start()
    })
  }

  range(start: number, stop: number, step: number) {
    return Array.from({ length: (stop - start) / step + 1 }, (v, i) => start + (i * step))
  }
}