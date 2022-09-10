import{setupVue}from"../../setup.js";import{TABS}from"../../components/tabs.js";import{D}from"../../utils/break_eternity.js";import{player}from"../../player.js";import{LAYER_DATA,ORE_DATA}from"./quarry.js";TABS.OreStats={disp:"Ores",component:{template:'<div>\n      <h2>Ore Stats</h2>\n      <div v-for="[name, block] of Object.entries(ORE_DATA)">\n        <ore-entry\n          v-if="D(player.quarry.depth).gte(block.range[0])"\n          type="ore"\n          :name="name"\n        />\n      </div>\n    </div>',setup:()=>({ORE_DATA:ORE_DATA,D:D,player:player})}},TABS.BlockStats={disp:"Blocks",component:{template:'<div>\n      <h2>Block Stats</h2>\n      <div>\n        Block spawn calculations work a bit differently.<br>\n        They are weighted and their weight increases up to "chance max" and then decreases\n        until it no longer spawns.\n        This scales linearly.\n      </div>\n      <div v-for="[name, block] of Object.entries(LAYER_DATA)">\n        <ore-entry\n          v-if="D(player.quarry.depth).gte(block.range.spawn)"\n          type=""\n          :name="name"\n        />\n      </div>\n    </div>',setup:()=>({LAYER_DATA:LAYER_DATA,D:D,player:player})}},setupVue["ore-entry"]={props:["type","name"],template:'\n    <h2 :style="{\'background-color\': ore.color}">{{name}}</h2>\n    <div>Health multiplier: {{ore.health}}x</div>\n    <div>Starts spawning at Depth {{isOre ? ore.range[0] : ore.range.spawn}}</div>\n    <div v-if="!isOre">\n      Spawn chance maxed at Depth {{ore.range.full}}<br>\n      Spawn chance decreasing starting at {{ore.range.decrease}}\n    </div>\n    <div>Stops spawning at Depth {{isOre ? ore.range[1] : ore.range.despawn}}</div>\n    <div v-if="isOre">\n      Rarity: {{ore.rarity}}<br>\n      Sell price multiplier: {{ore.sell}}x\n    </div>\n  ',computed:{ore(){return(this.isOre?ORE_DATA:LAYER_DATA)[this.name]},isOre(){return"ore"===this.type}}},TABS.Story={component:{template:"\n    <div>\n      <h2>Welcome!</h2>\n      <i>In a medieval colony...</i>\n\n      <br><br>\n      Where am I? How'd I get here? What am I doing here?<br>\n      Oh look, there's a village nearby.<br>\n      I'm just going to look around that settlement.\n\n      <br><br>\n      Hmmm... A worker? Maybe I can talk for a moment...<br>\n      I question about this settlement. The worker says, \"This is a quarry site, we mine for the motherland.\"<br>\n      I remember about how hard this was years ago. It was unbearable.<br>\n      But I come to a realization.\n\n      <br><br>\n      He was neither a brave worker, nor a slave.<br>\n      He needs mana in order to free himself with helpers.<br>\n      A-ha! Mana is what I need to live on, he said.<br>\n      And so, the journey begins.\n\n      <br><br>\n      Welcome to the Longest Incremental<sup>2</sup>. Here, you can hire Miners with Mana.<br>\n      Later on, you can sell ores for Green Papers which can be spent for Upgrades!<br>\n      Have fun <s>and don't forget about the void</s>!\n    </div>\n    <div v-if=\"false\">\n      <h2>Guilding</h2>\n      Soon.\n    </div>\n    "}};
