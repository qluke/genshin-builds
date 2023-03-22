import { NextApiRequest, NextApiResponse } from "next";
import GenshinData, { Artifact, Character, Weapon } from "genshin-data";
import prisma, { Build } from "@db/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid, lang } = req.query;

  if (!uid || !lang) {
    return res.status(400).json({ error: "Missing uid or lang" });
  }

  const gi = new GenshinData({ language: lang as any });
  console.log("uid", uid);

  const playerData = await prisma.player.findUnique({
    where: {
      uuid: uid as string,
    },
  });

  if (!playerData) {
    return res.status(404).json({
      error: "Player not found",
    });
  }

  const builds = await prisma.build.findMany({
    where: {
      player: {
        id: playerData.id,
      },
    },
  });

  const characters = await gi.characters();
  const weapons = await gi.weapons();
  const artifacts = await gi.artifacts();

  return res.status(200).json({
    uuid: playerData.uuid,
    nickname: playerData.nickname,
    profilePictureId: playerData.profilePictureId,
    profileCostumeId: playerData.profileCostumeId,
    namecardId: playerData.namecardId,
    level: playerData.level,
    signature: playerData.signature,
    worldLevel: playerData.worldLevel,
    finishAchievementNum: playerData.finishAchievementNum,
    region: regionParse(playerData.uuid),
    builds: await decodeBuilds(builds, characters, weapons, artifacts),
  });
}

function regionParse(uuid: string) {
  const suffix = uuid[0];
  switch (suffix) {
    case "0":
      return "Internal";
    case "1":
    case "2":
    case "5":
      return "CH";
    case "6":
      return "NA";
    case "7":
      return "EU";
    case "8":
    case "9":
      return "AS";
    default:
      return "Unknown";
  }
}

async function decodeBuilds(
  data: Build[],
  characters: Character[],
  weapons: Weapon[],
  artifacts: Artifact[]
) {
  const artifactsDetail = await import(
    "../../_content/genshin/data/artifacts_detail.json"
  );
  const decodeStr = (str: string) =>
    str.split(",").reduce((acc, stat) => {
      const [key, value] = stat.split("|");
      return {
        ...acc,
        [key]: Number(value),
      };
    }, {});
  const decodeSubstatStr = (str: string) =>
    str.split(",").reduce((acc, stat) => {
      const [key, data] = stat.split("|");
      const [value, count] = data.split("/");
      return {
        ...acc,
        [key]: {
          value: Number(value),
          count: Number(count),
        },
      };
    }, {});

  return data.map((build) => {
    const character = characters.find((c) => c._id === build.avatarId);

    if (!character) {
      return null;
    }

    const weapon = weapons.find((w) => w._id === build.weaponId);
    let flowerSet: Artifact | null = null;
    let plumeSet: Artifact | null = null;
    let sandsSet: Artifact | null = null;
    let gobletSet: Artifact | null = null;
    let circletSet: Artifact | null = null;
    artifactsDetail.default.forEach((value) => {
      if (!value.ids) {
        return;
      }
      if (value.ids.includes(build.flowerId.toString().slice(0, 4))) {
        flowerSet = artifacts.find(
          (a) => a._id === Number("2" + value.set)
        ) as Artifact;
      }

      if (value.ids.includes(build.plumeId.toString().slice(0, 4))) {
        plumeSet = artifacts.find(
          (a) => a._id === Number("2" + value.set)
        ) as Artifact;
      }

      if (value.ids.includes(build.sandsId.toString().slice(0, 4))) {
        sandsSet = artifacts.find(
          (a) => a._id === Number("2" + value.set)
        ) as Artifact;
      }

      if (value.ids.includes(build.gobletId.toString().slice(0, 4))) {
        gobletSet = artifacts.find(
          (a) => a._id === Number("2" + value.set)
        ) as Artifact;
      }

      if (value.ids.includes(build.circletId.toString().slice(0, 4))) {
        circletSet = artifacts.find(
          (a) => a._id === Number("2" + value.set)
        ) as Artifact;
      }
    });

    // remove duplicates and the ones that doesn't have 2 pieces or more
    const sets = [
      flowerSet!.id,
      plumeSet!.id,
      sandsSet!.id,
      gobletSet!.id,
      circletSet!.id,
    ]
      .filter((value, index, self) => {
        return (
          self.indexOf(value) === index &&
          self.filter((v) => v === value).length >= 2
        );
      })
      .map((id) => artifacts.find((a) => a.id === id) as Artifact);

    return {
      avatarId: build.avatarId,
      id: character.id,
      name: character.name,
      rarity: character.rarity,
      level: build.level,
      ascension: build.ascension,
      constellation: build.constellation,
      fetterLevel: build.fetterLevel,
      stats: decodeStr(build.fightProps),
      flower: {
        artifactId: build.flowerId,
        id: flowerSet!.flower?.id,
        name: flowerSet!.flower?.name,
        rarity: flowerSet!.max_rarity,
        mainStat: decodeStr(build.flowerMainStat),
        subStats: decodeSubstatStr(build.flowerSubStats),
        subStatsIds: build.flowerSubstatsId,
      },
      plume: {
        artifactId: build.plumeId,
        id: plumeSet!.plume?.id,
        name: plumeSet!.plume?.name,
        rarity: plumeSet!.max_rarity,
        mainStat: decodeStr(build.plumeMainStat),
        subStats: decodeSubstatStr(build.plumeSubStats),
        subStatsIds: build.plumeSubstatsId,
      },
      sands: {
        artifactId: build.sandsId,
        id: sandsSet!.sands?.id,
        name: sandsSet!.sands?.name,
        rarity: sandsSet!.max_rarity,
        mainStat: decodeStr(build.sandsMainStat),
        subStats: decodeSubstatStr(build.sandsSubStats),
        subStatsIds: build.sandsSubstatsId,
      },
      goblet: {
        artifactId: build.gobletId,
        id: gobletSet!.goblet?.id,
        name: gobletSet!.goblet?.name,
        rarity: gobletSet!.max_rarity,
        mainStat: decodeStr(build.gobletMainStat),
        subStats: decodeSubstatStr(build.gobletSubStats),
        subStatsIds: build.gobletSubstatsId,
      },
      circlet: {
        artifactId: build.circletId,
        id: circletSet!.circlet?.id,
        name: circletSet!.circlet?.name,
        rarity: circletSet!.max_rarity,
        mainStat: decodeStr(build.circletMainStat),
        subStats: decodeSubstatStr(build.circletSubStats),
        subStatsIds: build.circletSubstatsId,
      },
      sets,
      builds: {
        ...build,
      },
      weapon: {
        weaponId: build.weaponId,
        id: weapon?.id,
        name: weapon?.name,
        rarity: weapon?.rarity,
        level: build.weaponLevel,
        promoteLevel: build.weaponPromoteLevel,
        refinement: build.weaponRefinement,
        stat: decodeStr(build.weaponStat),
      },
    };
  });
}