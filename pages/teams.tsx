import GenshinData, { Character } from "genshin-data";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";

import TeamCard from "@components/genshin/TeamCard";
import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { CharacterTeam, TeamData, Teams } from "interfaces/teams";
import { Fragment } from "react";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type TeamsProps = {
  teamsByName: Record<
    string,
    (TeamData & { characters: (CharacterTeam & { name: string })[] })[]
  >;
  common: Record<string, string>;
};

const TeamsPage = ({ teamsByName }: TeamsProps) => {
  const { t } = useIntl("teams");
  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Best Team Comp | Party Building Guide",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "This is a guide to making the best party in Genshin Impact. Learn how to make the best party! We introduce the best party composition for each task including exploring areas, slaying field bosses, and more!",
        })}
      />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "best_team_comp", defaultMessage: "Best Team Comp" })}
      </h2>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(teamsByName).map(([mainName, teams]) => (
          <Fragment key={mainName}>
            {teams.map((team) => (
              <TeamCard key={team.name} team={team} mainName={mainName} />
            ))}
          </Fragment>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const teams = require(`../_content/genshin/data/teams.json`) as Teams;

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = (
    await genshinData.characters({
      select: ["id", "name", "element"],
    })
  ).reduce<Record<string, Character>>((map, val) => {
    map[val.id] = val;
    return map;
  }, {});

  let teamsf: any = {};

  Object.entries(teams).forEach(([id, tims]) => {
    if (!characters[id]?.name || !tims[0]) return;

    if (!teamsf[characters[id]?.name]) {
      teamsf[characters[id].name] = [];
    }

    teamsf[characters[id].name].push({
      name: tims[0].name,
      characters: tims[0].characters.map((c) => {
        return {
          id: c.id,
          name: characters[c.id]?.name || "",
          role: c.role,
          element: characters[c.id]?.element || "",
        };
      }),
    });
  });

  return {
    props: {
      teamsByName: teamsf,
      lngDict,
      bgStyle: {
        image: getUrlLQ(`/regions/Mondstadt_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default TeamsPage;
