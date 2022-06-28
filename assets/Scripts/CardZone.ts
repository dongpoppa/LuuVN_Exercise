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

  @property([cc.Prefab])
  cards: cc.Prefab[] = [];

  cards1: cc.Prefab[] = [];

  @property(cc.Node)
  handZone: cc.Node = null;

  cardNodes: cc.Node[] = []

  onLoad() {

    const cardCover = ["CardCoverFire", "CardCoverAir", "CardCoverEarth", "CardCoverWater"]
    const cardFront = ["CardFrontFire", "CardFrontAir", "CardFrontEarth", "CardFrontWater"]
    const creatureBgName = Array.from({ length: 36 }, (_, i) => `Creature_${i + 1}_Bg`)
    const creaturesName = Array.from({ length: 36 }, (_, i) => `Creature_${i + 1}`)

    const resouces = [...cardCover, ...cardFront, ...creatureBgName, ...creaturesName]

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
      this.handZone.getComponent("HandZone").addNewCard((this.cardNodes[0]))
      this.cardNodes.splice(0, 1)
    }
  }
}