import{player}from"../../player.js";import{DATA,TICK_DATA}from"../../tmp.js";import Decimal,{D}from"../../utils/break_eternity.js";import{format,formatPrecise,formatTime}from"../../utils/format.js";import{notify}from"../../utils/notify.js";import{collapse}from"../1-collapse/core.js";import{BUYABLES,getUpgradeEff,hasUpgrade}from"../../components/buyables.js";import{createChainedMulti,createMultiplicativeMulti,createUpgradeMulti}from"../../components/gainMulti.js";import{TABS}from"../../components/tabs.js";import{Resource,RESOURCES}from"../../components/resources.js";import{generateBlock,getBlockAmount}from"./blocks.js";import{getMinerEff}from"./miners.js";export const QUARRY_SIZE={width:10,height:10};export function getQuarryDepth(){return D(inQuarryMap()?player.quarry.inMap.depth:player.quarry.depth)}export function getEffectiveDepth(e){return D(e).gt(getVoidDepth())&&(e=D(e).sub(getVoidDepth()).mul(getVoidStrength()).add(getVoidDepth())),e}function generateQuarryRow(e){return Array(QUARRY_SIZE.width).fill().map((()=>generateBlock(e)))}function generateQuarryMap(e){return Array(QUARRY_SIZE.height).fill().map(((r,t)=>generateQuarryRow(e?t:getQuarryDepth().add(inQuarryMap()?0:t))))}export function initQuarry(){return{ores:{},depth:D(0),map:generateQuarryMap(!0),inMap:{}}}export function isBlockExposed(e,r){const t=player.quarry.map;return Decimal.lte(t[r-1]?.[e]?.health??Decimal.dZero,0)||Decimal.lte(t[r+1]?.[e]?.health??Decimal.dInf,0)||Decimal.lte(t[r]?.[e-1]?.health??Decimal.dInf,0)||Decimal.lte(t[r]?.[e+1]?.health??Decimal.dInf,0)}function deleteEmptyQuarryRows(){const e=inQuarryMap();for(;void 0!==player.quarry.map[0];){for(const e of player.quarry.map[0])if(Decimal.gt(e.health,0))return;player.quarry.map.splice(0,1),e?player.stats.mapRows=Decimal.add(player.stats.mapRows,1):(player.quarry.depth=Decimal.add(player.quarry.depth,1),D(player.quarry.depth).round().eq(getVoidDepth())&&notify("You have reached the void. At this point, no more ores will spawn and blocks scale faster. Collapse to proceed!"))}}function fillQuarryRows(){const e=inQuarryMap();for(;void 0===player.quarry.map[QUARRY_SIZE.height-1];)player.quarry.map.push(generateQuarryRow(D(getQuarryDepth()).add(e?0:player.quarry.map.length)))}export const LAYER_DATA={Grass:{color:"#3fbf00",range:{spawn:0,full:0,decrease:1,despawn:3},health:.5},Dirt:{color:"#7f5f3f",range:{spawn:1,full:1,decrease:4,despawn:6},health:1},Stone:{color:"grey",range:{spawn:3,full:6,decrease:45,despawn:50},health:2},Granite:{color:"#bf7f7f",range:{spawn:35,full:50,decrease:60,despawn:70},health:4},Basalt:{color:"#3f4f5f",range:{spawn:50,full:70,decrease:140,despawn:150},health:8},Obsidian:{color:"#0f0f3f",range:{spawn:130,full:150,decrease:190,despawn:190},health:16},Bedrock:{color:"#5f00bf",range:{spawn:190,full:190,decrease:200,despawn:200},health:32},Magma:{color:"#bf5f00",range:{spawn:190,full:200,decrease:200,despawn:200},health:64},Darkstone:{color:"#5f00bf",range:{spawn:200,full:300,decrease:300,despawn:300},health:48}};export function getLayerRarity(e,r){return(e=D(e)).gte(r.full)&&e.lte(r.decrease)?1:e.lte(r.spawn)||e.gte(r.despawn)?0:e.lt(r.full)?e.sub(r.spawn).div(D(r.full).sub(r.spawn)).toNumber():1-e.sub(r.decrease).div(D(r.despawn).sub(r.decrease)).toNumber()}export const ORE_DATA={Bronze:{color:"#CD7F32",range:[2,75],health:1.5,sell:1,rarity:1},Silver:{color:"#f2f0f0",range:[4,100],health:2,sell:1.5,rarity:3},Gold:{color:"#ffe600",range:[10,100],health:3,sell:2,rarity:5},Diamond:{color:"#91fffa",range:[25,125],health:5,sell:3,rarity:10},Platinum:{color:"#e9ffd4",range:[50,175],health:10,sell:5,rarity:20}};for(const[e,r]of Object.entries(ORE_DATA)){let t=e.toLowerCase();RESOURCES[t]=new Resource({name:e,color:r.color,src:{parent:()=>player.quarry.ores,id:e},multipliers:{ore:createChainedMulti((()=>1),createMultiplicativeMulti(createUpgradeMulti({group:"GreenPapers",id:2,type:"multiply"})),createMultiplicativeMulti(createUpgradeMulti({group:"GreenPapers",id:6,type:"multiply"})),createMultiplicativeMulti(createUpgradeMulti({group:"GreenPapers",id:9,type:"multiply"})),createMultiplicativeMulti({toMultiply:()=>getOreSparseness(e).recip(),enabled:()=>!0,name:"Sparseness Multiplier"})),gp:createChainedMulti((()=>Decimal.div(ORE_DATA[e].sell??1,5)),createMultiplicativeMulti(createUpgradeMulti({group:"GreenPapers",id:8,type:"multiply"})),createMultiplicativeMulti({toMultiply:()=>getOreSparseness(e),enabled:()=>!0,name:"Sparseness Multiplier"}))}})}function getOreSparseness(e){return Decimal.div(getQuarryDepth(),100).add(1).mul(Decimal.add(Object.keys(ORE_DATA).indexOf(e),1))}export function getOreWorthMul(e){let r=Decimal.dOne;return hasUpgrade("GreenPapers",8)&&(r=r.mul(getUpgradeEff("GreenPapers",8))),r}function getOreWorth(e){return RESOURCES[e.toLowerCase()].multipliers.gp.value()}export function getOreGain(e){return RESOURCES[e.toLowerCase()].multipliers.ore.value()}function getOreCost(e){return getOreWorth(e).mul(1.5)}function getAllWorth(){let e=new Decimal(0);for(const r of Object.keys(ORE_DATA))e=e.add(getBlockAmount(r).mul(getOreWorth(r)));return e}function sellAllOres(){for(const e of Object.keys(ORE_DATA))sellOre(e)}function sellOre(e){RESOURCES.greenPaper.add(getBlockAmount(e).mul(getOreWorth(e))),RESOURCES[e.toLowerCase()].set(0)}function buyOreAmount(e){const r=DATA.resources.greenPaper.amt.value.div(2),t=getOreCost(e);return r.div(t).floor()}function buyOre(e){const r=DATA.resources.greenPaper.amt.value.div(2),t=getOreCost(e),a=r.div(t).floor();a.gt(0)&&(RESOURCES.greenPaper.sub(t.mul(a)),RESOURCES[e.toLowerCase()].add(a))}export function getVoidDepth(){return D(100)}function getVoidStrength(){return 1.5}export function inQuarryMap(){return!!DATA.setup&&void 0!==player.quarry.inMap.depth}export const switchMap=window.switchMap=function(e){player.quarry.inMap=e,e||(player.quarry.inMap={}),player.quarry.map=generateQuarryMap()};TICK_DATA.quarry=function(e){void 0===player.quarry&&(player.quarry=initQuarry());for(const r of BUYABLES.Miners.data)r.hit(e);deleteEmptyQuarryRows(),fillQuarryRows()},TABS.Quarry={subtabs:["QuarrySite","Equipment","GreenPapers"]},TABS.QuarrySite={disp:"The Site",component:{template:'\n      <div>\n        <div>\n          <span v-if="player.miners.manualCooldown">\n            Click cooldown: {{formatTime(player.miners.manualCooldown)}}\n          </span>\n          <span v-else>\n            Click on any highlighted block to deal <span class="tooltip detailed">\n              <span>{{format(getMinerEff(0))}} damage</span>\n              <span class="tooltiptext">Click cooldown is equal to 1/[Novice Miners\' seconds/hit]</span>\n            </span>.\n          </span>\n          <div v-if="!player.quarry.inMap.depth">You are currently in Depth {{format(player.quarry.depth, 0)}} / 100.</div>\n          <div>\n            <button v-if="player.quarry.inMap.depth" onclick="switchMap()">Exit Map</button>\n            <button \n              v-if="new Decimal(player.quarry.depth).round().gte(getVoidDepth()) \n              && hasUpgrade(\'GreenPapers\', 10) && !player.quarry.inMap" \n              @click="collapse()"\n            >(C) Collapse!</button>\n          </div>\n        </div>\n        <div class="flex">\n          <miners class="flex-base" style="flex-basis:33%" />\n          <div class="flex-base" style="flex-basis:33%">\n            <grid type="Block" \n              :width="QUARRY_SIZE.width" \n              :height="QUARRY_SIZE.height" \n              style="border: 2px solid #80400" \n              /><br>\n            <block-stats />\n          </div>\n          <div \n            class="flex-base" \n            style="flex-basis:33%"\n          >\n            <resource name="greenPaper" />\n            <button @click="sellAllOres()">Sell all for {{format(getAllWorth())}} GP</button>\n            <table class="resourceTable">\n              <tr>\n                <td colspan="2">\n                  Note: Quarry depth multiplies ore value but nerfs ore gain.\n                </td>\n              </tr>\n              <tr \n                v-for="[index, key] of Object.entries(ORE_DATA).filter(\n                  (x) => getBlockAmount(x[0]).gt(0))"\n                :key="index">\n                <td style="width:100%;font-size:13.3333px;text-align:left">\n                  <resource :name="index.toLowerCase()"/>\n                  <gain-multi :multi="RESOURCES[index.toLowerCase()].multipliers.ore">\n                    {{format(getOreGain(index))}} unit/damage dealt\n                  </gain-multi> ×\n                  <gain-multi :multi="RESOURCES[index.toLowerCase()].multipliers.gp">\n                    {{format(getOreWorth(index))}} GP/unit\n                  </gain-multi>\n                </td>\n                <td>\n                  <button @click="sellOre(index)">\n                    Sell for {{format(getBlockAmount(index).mul(getOreWorth(index)))}} GP\n                  </button>\n                  <button v-if="hasUpgrade(\'GreenPapers\', 4)" @click="buyOre(index)">\n                    Buy {{format(buyOreAmount(index))}} {{index}} with 50% GP\n                  </button>\n                </td>\n              </tr>\n            </table>\n          </div>\n        </div>\n      </div>\n    ',setup(){const e=DATA.resources;return{ORE_DATA:ORE_DATA,QUARRY_SIZE:QUARRY_SIZE,RESOURCES:RESOURCES,Decimal:Decimal,format:format,formatPrecise:formatPrecise,formatTime:formatTime,player:player,resources:e,hasUpgrade:hasUpgrade,notify:notify,getBlockAmount:getBlockAmount,getOreWorth:getOreWorth,getAllWorth:getAllWorth,getOreCost:getOreCost,buyOreAmount:buyOreAmount,sellOre:sellOre,sellAllOres:sellAllOres,buyOre:buyOre,getOreGain:getOreGain,getMinerEff:getMinerEff,getVoidDepth:getVoidDepth,collapse:collapse}}}};
