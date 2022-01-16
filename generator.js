import fs from "fs";

const rarities = [
  { value: "Common", weight: 1, modifier: 0 },
  { value: "Uncommon", weight: .3333, modifier: .1},
  { value: "Rare", weight: .1, modifier: .2 },
  { value: "Epic", weight: .03333, modifier: .25 },
  { value: "Legendary", weight: .01, modifier: .3 },
];

const rarityModifier = [
  { value: "Common", rarity: rarities[0] },
  { value: "Uncommon", rarity: rarities[1] },
  { value: "Rare", rarity: rarities[2] },
  { value: "Epic", rarity: rarities[3] },
  { value: "Legendary", rarity: rarities[4] },
];

const BladeColor = [
  { value: "Blue", rarity: rarities[0] },
  { value: "Green", rarity: rarities[0] },
  { value: "Red", rarity: rarities[0] },
  { value: "Yellow", rarity: rarities[0] },
  { value: "Orange", rarity: rarities[1] },
  { value: "Cyan", rarity: rarities[1] },
  { value: "Purple", rarity: rarities[1] },
  { value: "Pink", rarity: rarities[2] },
  { value: "Silver", rarity: rarities[2] },
  { value: "White", rarity: rarities[2] },
  { value: "Black", rarity: rarities[3] }
];

const EmitterType = [
  { value: "Inquisitor", rarity: rarities[0] },
  { value: "Avenger", rarity: rarities[0] },
  { value: "Defender", rarity: rarities[0] },
  { value: "Paladin", rarity: rarities[0] },
  { value: "Redeemer", rarity: rarities[0] },
  { value: "Devastator", rarity: rarities[0] },
  { value: "Zealot", rarity: rarities[0] },
  { value: "Sentinel", rarity: rarities[0] },
  { value: "Protector", rarity: rarities[1] },
  { value: "Crusader", rarity: rarities[1] },
  { value: "Templar", rarity: rarities[1] },
  { value: "Seer", rarity: rarities[1] },
  { value: "Silencer", rarity: rarities[1] },
  { value: "Liberator", rarity: rarities[1] },
  { value: "Guardian", rarity: rarities[1] },
  { value: "Exemplar", rarity: rarities[2] },
  { value: "Vindicator", rarity: rarities[2] },
  { value: "Vigilante", rarity: rarities[2] },
  { value: "Vanquisher", rarity: rarities[2] },
  { value: "Conqueror", rarity: rarities[2] },
  { value: "Steward", rarity: rarities[3] },
  { value: "Warden", rarity: rarities[3] }
];

const SwitchType = EmitterType

const HandleType = EmitterType

const ColorScheme = [
  { value: "BlackSilver", rarity: rarities[0] },
  { value: "SilverBronze", rarity: rarities[0] },
  { value: "BlackGold", rarity: rarities[1] },
  { value: "WhiteSilver", rarity: rarities[1] },
  { value: "RedSilver", rarity: rarities[1] },
  { value: "YellowBlack", rarity: rarities[2] },
  { value: "PinkWhite", rarity: rarities[2] },
  { value: "Gold", rarity: rarities[3] }
];

const getTableOutput = ((randomNumber, table, min = 0) => {
  let totalVal;
    totalVal = table.reduce((a, b) => a + b.rarity.weight, 0);

  const adjustedVal = totalVal - min;
  const roll = randomNumber * adjustedVal + min;

  for(let i = 0; i < table.length; i++){
    if(i === 0) table[i]['min'] = 0;
    else table[i]['min'] = table.slice(0,i).reduce((a, b) => a + b.rarity.weight, 0);
    if(i === table.length - 1) table[i]['max'] = totalVal+1000;
    else table[i]['max'] = table.slice(0,i+1).reduce((a, b) => a + b.rarity.weight, 0);
  } 

  const output = table.find(x => roll >= x['min'] && roll <= x.max);

  return output;
});

export default function generateSaberStats( alreadyCreatedSabers = []) {
  // Rarity modifier
  let rarity = getTableOutput(Math.random(), rarityModifier);
  const fixedRarityModifier = rarities.find(x => x.value === rarity.value).modifier;
  // BladeColor
  const bladeColor = getTableOutput(Math.random(), BladeColor, fixedRarityModifier);

  // EmitterType
  const emitterType = getTableOutput(Math.random(), EmitterType, fixedRarityModifier);

  // SwitchType
  const switchType = getTableOutput(Math.random(), SwitchType, fixedRarityModifier);

  // HandleType
  const handleType = getTableOutput(Math.random(), HandleType, fixedRarityModifier);

  // ColorScheme
  const colorScheme = getTableOutput(Math.random(), ColorScheme, fixedRarityModifier);

  let hash = rarity.value + " | " + bladeColor.value + " | " + emitterType.value + " | " + switchType.value + " | " + handleType.value + " | " + colorScheme.value;

  const alreadyExists = alreadyCreatedSabers.filter(saber => hash == saber.hash).length > 0;

  const saber = {
    rarity: rarity.value,
    bladeColor: bladeColor.value,
    emitterType: emitterType.value,
    switchType: switchType.value,
    handleType: handleType.value,
    colorScheme: colorScheme.value,
    duplicate: alreadyExists,
    hash: hash
  }

  alreadyCreatedSabers.push(saber);

  return saber;
}


const series = [];
// How many sabers to generate in the series?
const seriesSize = 10000;

for(let i = 0; i < seriesSize; i++) {
  const saber = generateSaberStats()
  if (!saber.duplicate) series.push(saber);
}

const seriesFiltered = []
series.forEach(saber => {
  const newSaber = {...saber};
  delete newSaber['duplicate'];
  delete newSaber['hash'];
  delete newSaber['rarity']; 
  seriesFiltered.push(newSaber);
})

const data = JSON.stringify(seriesFiltered);

fs.writeFileSync("sabers.json", data);

console.log("Made a series with", seriesSize, "attempted. Generated", seriesFiltered.length, "sabers");
if (seriesFiltered.length < seriesSize) {
  console.log("Try adding more unique options to generators to increase likelihood of successful generation");
}
console.log("Commons", series.filter(saber => saber.rarity === "Common").length);
console.log("Uncommons", series.filter(saber => saber.rarity === "Uncommon").length);
console.log("Rares", series.filter(saber => saber.rarity === "Rare").length);
console.log("Epics", series.filter(saber => saber.rarity === "Epic").length);
console.log("Legendaries", series.filter(saber => saber.rarity === "Legendary").length);
console.log("White Blades", series.filter(saber => saber.bladeColor === "White").length);
console.log("Black Blades", series.filter(saber => saber.bladeColor === "Black").length);
console.log("Gold Material", series.filter(saber => saber.colorScheme === "Gold").length);
console.log("Ultrarare", series.filter(saber => saber.colorScheme === "Gold" && saber.bladeColor === "Black").length);
