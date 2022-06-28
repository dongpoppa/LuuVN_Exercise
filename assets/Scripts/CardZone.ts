// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import allCretures from './AllCretures'
@ccclass
export default class CardZone extends cc.Component {

  @property(cc.Node)
  handZone: cc.Node = null;

  @property(cc.Prefab)
  cardBack: cc.Prefab = null;

  cardNodes: cc.Node[] = []

  onLoad() {

    const cardCover = ["CardCoverFire", "CardCoverAir", "CardCoverEarth", "CardCoverWater"]
    const cardFront = ["CardFrontFire", "CardFrontAir", "CardFrontEarth", "CardFrontWater"]
    const creatureBgName = Array.from({ length: 36 }, (_, i) => `Creature_${i + 1}_Bg`)
    const creaturesName = Array.from({ length: 36 }, (_, i) => `Creature_${i + 1}`)

    const resouces = [...cardCover, ...cardFront, ...creatureBgName, ...creaturesName]

    for (let index = 0; index < 5; index++) {
      setTimeout(() => {
        this.drawACard()
      }, 150 * index);
    }

    cc.assetManager.loadBundle('Prefab', (errPrefab, prefab) => {
      prefab.load("Card", (errCard: any, card: cc.Prefab) => {
        cc.assetManager.loadBundle('BattleCard', (errBattleCard, battleCard) => {
          battleCard.load(resouces, cc.SpriteFrame, (errTextures: any, textures: cc.SpriteFrame[]) => {

            this.cardNodes = allCretures.map((item, index) => {
              let returnCard = cc.instantiate(card)
              const creature = textures.find(i => i.name === item.creature)
              const creatureBg = textures.find(i => i.name === item.creatureBg)
              const cover = textures.find(i => i.name === item.cardCover)
              const front = textures.find(i => i.name === item.cardFront)
              returnCard.getChildByName("Creature").getComponent(cc.Sprite).spriteFrame = creature
              returnCard.getChildByName("Creature_Bg").getComponent(cc.Sprite).spriteFrame = creatureBg
              returnCard.getChildByName("CardCover").getComponent(cc.Sprite).spriteFrame = cover
              returnCard.getChildByName("CardFront").getComponent(cc.Sprite).spriteFrame = front
              returnCard.getChildByName("CardManaIcon").getChildByName("Mana").getComponent(cc.Label).string = item.mana
              returnCard.getChildByName("Attack").getComponent(cc.Label).string = item.attack
              returnCard.getChildByName("HP").getComponent(cc.Label).string = item.hp
              returnCard.getChildByName("Name").getComponent(cc.Label).string = item.name
              returnCard.getChildByName("Description").getComponent(cc.Label).string = item.description
              returnCard.name = `Card_${index + 1}`
              return returnCard
            })

            const beginCards = this.cardNodes.slice(0, 5)
            this.handZone.getComponent("HandZone").cards = beginCards;
            this.handZone.getComponent("HandZone").onLoad();
            this.cardNodes.splice(0, 5)
          })
        });
      })
    });
  }

  addNewCard() {
    if (this.cardNodes[0]) {
      this.drawACard()
      setTimeout(() => {
        this.handZone.getComponent("HandZone").addNewCard((this.cardNodes[0]))
        this.cardNodes.splice(0, 1)
      }, 500)
    }
  }

  drawACard() {
    const newNode = cc.instantiate(this.cardBack)
    newNode.setPosition(760, -137)
    newNode.setScale(0.74, 0.5)
    newNode.anchorX = 0.5
    newNode.anchorY = 0.5
    newNode.width = 201
    newNode.height = 298
    newNode.skewX = -21

    this.node.addChild(newNode)
    cc.tween(newNode)
      .to(0.5, { x: 340, y: -650, skewX: 0, scaleY: 0.7 }, { easing: 'quadInOut' })
      .start();

    setTimeout(() => {
      newNode.destroy()
    }, 500);
  }
}