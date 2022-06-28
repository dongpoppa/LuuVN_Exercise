// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChangeScreen extends cc.Component {

    @property(cc.String)
    nextScene: string = "";

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this.node.on(cc.Node.EventType.MOUSE_DOWN, this.changeScreen, this)
    }

    changeScreen() {
    this.nextScene ? cc.director.loadScene(this.nextScene) : ""
    }
    // update (dt) {}
}
