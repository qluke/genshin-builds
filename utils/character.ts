import { Ascension, TalentMaterial } from "genshin-data/dist/types/character";

export type AscensionTotal = {
  items: MaterialTotal[];
  cost: number;
};

export type TalentTotal = {
  items: MaterialTotal[];
  cost: number;
};

export type MaterialTotal = {
  id: string;
  name: string;
  amount: number;
  rarity: number;
  type: string;
  index: number;
};

export function calculateTotalAscensionMaterials(
  ascension: Ascension[],
  ascensionMin = 1,
  ascensionMax = 6
) {
  if (ascensionMin === ascensionMax) return { items: [], cost: 0 };
  const talentIndexFolder = [
    "jewels_materials",
    "elemental_stone_materials",
    "local_materials",
    "common_materials",
  ];
  return ascension
    .filter(
      (asc) => asc.ascension >= ascensionMin && asc.ascension <= ascensionMax
    )
    .reduce<AscensionTotal>(
      (acc, cur) => {
        acc.cost = acc.cost + cur.cost;
        let mat2: any = {};
        if (cur.mat2) {
          mat2 = {
            id: cur.mat2.id,
            name: cur.mat2.name,
            type: talentIndexFolder[1],
            rarity: cur.mat2.rarity,
            amount: cur.mat2.amount,
            index: 1,
          };
        }
        acc.items = [
          {
            id: cur.mat1.id,
            name: cur.mat1.name,
            type: talentIndexFolder[0],
            rarity: cur.mat1.rarity,
            amount: cur.mat1.amount,
            index: 0,
          },
          mat2,
          {
            id: cur.mat3.id,
            name: cur.mat3.name,
            type: talentIndexFolder[2],
            rarity: cur.mat3.rarity,
            amount: cur.mat3.amount,
            index: 2,
          },
          {
            id: cur.mat4.id,
            name: cur.mat4.name,
            type: talentIndexFolder[3],
            rarity: cur.mat4.rarity,
            amount: cur.mat4.amount,
            index: 3,
          },
          ...acc.items,
        ]
          .filter((item) => item.id)
          .reduce<MaterialTotal[]>((acc2, cur2) => {
            const existing = acc2.find((item) => item.id === cur2.id);
            if (existing) {
              existing.amount = existing.amount + cur2.amount;
            } else {
              acc2.push(cur2);
            }
            return acc2;
          }, [])
          .sort((a, b) => a.index - b.index || a.rarity - b.rarity);
        return acc;
      },
      { cost: 0, items: [] }
    );
}

export function calculateTotalTalentMaterials(
  talents: TalentMaterial[],
  levelMin = 1,
  levelMax = 10
) {
  const talentIndexFolder = [
    "talent_lvl_up_materials",
    "common_materials",
    "talent_lvl_up_materials",
    "talent_lvl_up_materials",
  ];
  return talents
    .filter((t) => t.level >= levelMin && t.level <= levelMax)
    .reduce<TalentTotal>(
      (acc, cur) => {
        acc.cost = acc.cost + cur.cost;
        acc.items = [
          ...cur.items.map((item, index) => ({
            id: item.id,
            name: item.name,
            type: talentIndexFolder[index],
            rarity: item.rarity,
            amount: item.amount,
            index: index,
          })),
          ...acc.items,
        ]
          .reduce<MaterialTotal[]>((acc2, cur2) => {
            const existing = acc2.find((item) => item.id === cur2.id);
            if (existing) {
              existing.amount = existing.amount + cur2.amount;
            } else {
              acc2.push(cur2);
            }
            return acc2;
          }, [])
          .sort((a, b) => a.index - b.index || a.rarity - b.rarity);
        return acc;
      },
      { cost: 0, items: [] }
    );
}
