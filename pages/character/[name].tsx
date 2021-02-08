import { ReactNode, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { GetStaticProps, GetStaticPaths } from "next";
import GenshinData, { Artifact, Character, Weapon } from "genshin-data";

import useIntl from "@hooks/use-intl";

import ElementIcon from "@components/ElementIcon";
import Collapsible from "@components/Collapsible";
import WeaponCard from "@components/WeaponCard";
import ArtifactCard from "@components/ArtifactCard";

import { localeToLang } from "@utils/locale-to-lang";

import { appBackgroundStyleState } from "@state/background-atom";

interface CharacterPageProps {
  character: Character;
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact>;
  lngDict: Record<string, string>;
}

const CharacterPage = ({
  character,
  weapons,
  artifacts,
  lngDict,
}: CharacterPageProps) => {
  const setBg = useSetRecoilState(appBackgroundStyleState);
  const [f] = useIntl(lngDict);
  useEffect(() => {
    setBg({
      image: `/regions/${character.region}_d.jpg`,
      gradient: {
        background:
          "linear-gradient(rgba(26,28,35,.8),rgb(18, 19, 23) 620px),radial-gradient(at center top,rgba(21,28,36,0) 60%,rgb(18, 19, 23) 80%)",
      },
    });
  }, [character]);
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center px-2 md:px-0">
          <div className="flex-none relative mr-2 md:mr-5">
            <img
              className="w-24 h-24 bg-vulcan-800 p-1 rounded-full border border-gray-900"
              src={`/characters/${character.id}/${character.id}_portrait.png`}
              alt={character.name}
            />
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex items-center mr-2">
              <h1 className="text-3xl mr-2">
                {character.name} ({character.rarity}★)
              </h1>
              <ElementIcon type={character.element} width={30} height={30} />
            </div>
            <div>{character.description}</div>
          </div>
        </div>
      </div>
      <div className="min-w-0 p-4 md:mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <div className="mb-4">
          <h2 className="text-3xl mb-2">
            {f({ id: "character.skills", defaultMessage: "Skills" })}
          </h2>
          {character.skills.map((skill) => (
            <Collapsible
              key={skill.id}
              text={
                <div className="flex self-center">
                  <img
                    className="block mr-2"
                    src={`/characters/${character.id}/${skill.id}.png`}
                    height={32}
                    width={32}
                  />
                  <h3 className="text-xl">
                    <b>{skill.type}</b>: {skill.name}
                  </h3>
                </div>
              }
            >
              <div dangerouslySetInnerHTML={{ __html: skill.description }} />
            </Collapsible>
          ))}
        </div>
        <div className="mb-4">
          <h2 className="text-3xl mb-2">
            {f({ id: "character.passives", defaultMessage: "Passives" })}
          </h2>
          {character.passives.map((passive) => (
            <Collapsible
              key={passive.id}
              text={
                <div className="flex self-center">
                  <img
                    className="block mr-2"
                    src={`/characters/${character.id}/${passive.id}.png`}
                    height={32}
                    width={32}
                  />
                  <h3 className="text-xl">{passive.name}</h3>
                </div>
              }
            >
              <div dangerouslySetInnerHTML={{ __html: passive.description }} />
            </Collapsible>
          ))}
        </div>
        <div className="mb-4">
          <h2 className="text-3xl mb-2">
            {f({
              id: "character.constellations",
              defaultMessage: "Constellations",
            })}
          </h2>
          {character.constellations.map((constellation) => (
            <Collapsible
              key={constellation.id}
              text={
                <div className="flex self-center">
                  <img
                    className="block mr-2"
                    src={`/characters/${character.id}/${constellation.id}.png`}
                    height={32}
                    width={32}
                  />
                  <h3 className="text-xl">
                    {constellation.level}: {constellation.name}
                  </h3>
                </div>
              }
            >
              <div
                dangerouslySetInnerHTML={{ __html: constellation.description }}
              />
            </Collapsible>
          ))}
        </div>
        {character.builds && (
          <div className="mb-4">
            <h2 className="text-3xl">
              {f({
                id: "character.builds",
                defaultMessage: "Builds",
              })}
            </h2>
            {character.builds.map((build) => (
              <div key={build.id} className="">
                <h3 className="text-2xl">{build.role}</h3>
                <p>{build.description}</p>
                <div className="grid grid-cols-2">
                  <div className="flex flex-wrap w-4/5 pr-2 content-start">
                    <b className="mb-2">
                      {f({
                        id: "weapons",
                        defaultMessage: "Weapons",
                      })}
                      :
                    </b>
                    {build.weapons
                      .map<ReactNode>((weapon) => (
                        <WeaponCard weapon={weapons[weapon.id]} />
                      ))
                      .reduce((prev, curr) => [
                        prev,
                        <div className="build-option-divider">
                          {f({
                            id: "or",
                            defaultMessage: "Or",
                          })}
                        </div>,
                        curr,
                      ])}
                  </div>
                  <div className="flex flex-wrap w-4/5 ml-2 content-start">
                    <b className="mb-2">
                      {f({
                        id: "artifacts",
                        defaultMessage: "Artifacts",
                      })}
                      :
                    </b>
                    {build.sets
                      .map<ReactNode>((set) => (
                        <>
                          {set.set_2 ? (
                            <div className="flex flex-row">
                              <ArtifactCard
                                artifact={artifacts[set.set_1.id]}
                                recommendedStats={build.stats_priority}
                                pieces={2}
                              />
                              <ArtifactCard
                                artifact={artifacts[set.set_2.id]}
                                recommendedStats={build.stats_priority}
                                pieces={2}
                              />
                            </div>
                          ) : (
                            <ArtifactCard
                              artifact={artifacts[set.set_1.id]}
                              recommendedStats={build.stats_priority}
                              pieces={4}
                            />
                          )}
                        </>
                      ))
                      .reduce((prev, curr) => [
                        prev,
                        <div className="build-option-divider">
                          {f({
                            id: "or",
                            defaultMessage: "Or",
                          })}
                        </div>,
                        curr,
                      ])}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const { default: lngDict = {} } = await import(
    `../../locales/${locale}.json`
  );

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters();
  const character = characters.find((c) => c.id === params?.name);

  if (!character) {
    return {
      notFound: true,
    };
  }

  const weaponsList = await genshinData.weapons();
  const artifactsList = await genshinData.artifacts();

  let weapons: Record<string, Weapon> = {};
  let artifacts: Record<string, Artifact> = {};

  if (character?.builds) {
    const weaponsIds: string[] = [];
    const artifactsIds: string[] = [];
    character.builds.forEach((build) => {
      weaponsIds.push(...build.weapons.map((w) => w.id));
      artifactsIds.push(
        ...build.sets.reduce<string[]>((arr, set) => {
          arr.push(set.set_1.id);
          if (set.set_2) {
            arr.push(set.set_2.id);
          }

          return arr;
        }, [])
      );
    });

    weaponsList.forEach((weapon) => {
      if (weaponsIds.includes(weapon.id)) {
        weapons[weapon.id] = weapon;
      }
    });

    artifactsList.forEach((artifact) => {
      if (artifactsIds.includes(artifact.id)) {
        artifacts[artifact.id] = artifact;
      }
    });
  }

  return {
    props: {
      character,
      weapons,
      artifacts,
      lngDict,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const genshinData = new GenshinData();
  const characters = await genshinData.characters();

  const paths: { params: { name: string }; locale: string }[] = [];

  for (const locale of locales) {
    characters.forEach((character) => {
      paths.push({ params: { name: character.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default CharacterPage;