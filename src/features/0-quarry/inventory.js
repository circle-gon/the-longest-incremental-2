import{player}from"../../player.js";import{setupVue}from"../../setup.js";import{ref}from"https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";import{hasUpgrade}from"../../components/buyables.js";import{TABS}from"../../components/tabs.js";import{notify}from"../../utils/notify.js";import{switchMap,inQuarryMap}from"./quarry.js";import{format,formatChange}from"../../utils/format.js";let inventoryMode=ref("usage");export function obtainInventory(e,t){let n=player.inventory[e];Object.keys(n).length>=10?notify("Max inventory reached!"):n.push(t)}function deleteInventory(e,t){inQuarryMap()&&"map"===e?notify("Cannot delete maps while in a map."):confirm("Are you sure to delete this?")&&(notify("Item deleted."),player.inventory[e].splice(t,1))}function clickInventoryItem(e,t,n){"delete"===inventoryMode.value?deleteInventory(e,t):"map"===e&&(switchMap(n),notify("Map loaded."))}function switchInventoryMode(){inventoryMode.value="usage"===inventoryMode.value?"delete":"usage"}function inventoryDisplay(e,t){const n={text:"",buttonBG:"transparent"};return"map"===e&&(n.text="M"+format(t.depth,0),n.buttonBG="#ffff88"),n}TABS.Equipment={unl:()=>hasUpgrade("GreenPapers",3),component:{template:'<div>\n      You can hold up to 10 unique items for each type.<br>\n      <button @click="switchInventoryMode()" class="tooltip">\n        Mode: {{InventoryMode === \'usage\' ? "Use" : "Delete"}}\n        <span class="tooltiptext">Click / Tap to {{InventoryMode.value === \'usage\' ? "delete" : "use"}} an item.</span>\n      </button>\n\n      <br>\n      <h2>Maps</h2>\n      <Inventory type="map"/>\n    </div>',setup:()=>({switchInventoryMode:switchInventoryMode,InventoryMode:inventoryMode})}},setupVue.Inventory={props:["type"],template:'\n  <div class="inventory">\n    <div v-for="[index, item] of Object.entries(data)" style="display: initial;">\n      <button \n        @click="clickInventoryItem(type, index, item)"\n        class="tooltip"\n        style=\'border: 2px solid grey; height: 60px; width: 60px\'\n        :style="{background: inventoryDisplay(type, item).buttonBG}"\n      >\n        {{inventoryDisplay(type, item).text}}\n        <span v-if="type == \'map\'" class="tooltiptext">\n          Depth: {{format(item.depth, 0)}}<br>\n          Health: {{formatChange(item.health)}}<br>\n          Luck: {{formatChange(item.luck)}}<br>\n          Frequency: {{formatChange(item.freq)}}\n        </span>\n      </button>\n      <br v-if="(index % equipmentSplit(data)) === equipmentSplit(data)-1">\n    </div>\n  </div>',setup:e=>({data:player.inventory[e.type],inventoryDisplay:inventoryDisplay,format:format,formatChange:formatChange,clickInventoryItem:clickInventoryItem,equipmentSplit:e=>Math.ceil(e.length/2)})};
