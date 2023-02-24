import Link from "next/link";
import { GetStaticProps } from "next";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import TOFData, { Languages, Matrix, languages } from "tof-builds";

import Ads from "@components/ui/Ads";
import Metadata from "@components/Metadata";
import MatrixPortrait from "@components/tof/MatrixPortrait";

import { getDefaultLocale, getLocale } from "@lib/localData";
import { getRarityColor } from "@utils/rarity";
import useIntl from "@hooks/use-intl";
import { getTofUrlLQ } from "@lib/imgUrl";

type Props = {
  ssr: Matrix[];
  sr: Matrix[];
  r: Matrix[];
  n: Matrix[];
};

function Matrices({ ssr, sr, r, n }: Props) {
  const { t } = useIntl("matrices");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "ToF Impact Matrices List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "All Matrices ranked in order of power, viability, and versatility to clear content.",
        })}
      />
      <div className="mb-8">
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("SSR")}>SSR</span>{" "}
          <span className="text-tof-200">
            {t({ id: "matrices", defaultMessage: "Matrices" })}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 py-4 px-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {ssr.map((matrix) => (
            <Link key={matrix.id} href={`/tof/matrices/${matrix.id}`}>
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <div className="mb-8">
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("SR")}>SR</span>{" "}
          <span className="text-tof-200">
            {t({ id: "matrices", defaultMessage: "Matrices" })}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 py-4 px-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {sr.map((matrix) => (
            <Link key={matrix.id} href={`/tof/matrices/${matrix.id}`}>
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("R")}>R</span>{" "}
          <span className="text-tof-200">
            {t({ id: "matrices", defaultMessage: "Matrices" })}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 py-4 px-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {r.map((matrix) => (
            <Link key={matrix.id} href={`/tof/matrices/${matrix.id}`}>
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("N")}>N</span>{" "}
          <span className="text-tof-200">
            {t({ id: "matrices", defaultMessage: "Matrices" })}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 py-4 px-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {n.map((matrix) => (
            <Link key={matrix.id} href={`/tof/matrices/${matrix.id}`}>
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const defaultLocale = getDefaultLocale(
    locale,
    languages as unknown as string[]
  );
  const lngDict = await getLocale(defaultLocale, "tof");
  const tofData = new TOFData({
    language: defaultLocale as Languages,
  });
  const matrices = (
    await tofData.matrices({
      select: ["id", "name", "suitName", "rarity", "hash"],
    })
  ).map((matrix) => ({ ...matrix, suitName: matrix.suitName ?? "" }));

  const ssr = matrices.filter((m) => m.rarity === "SSR");
  const sr = matrices.filter((m) => m.rarity === "SR");
  const r = matrices.filter((m) => m.rarity === "R");
  const n = matrices.filter((m) => m.rarity === "N");

  return {
    props: {
      ssr,
      sr,
      r,
      n,
      lngDict,
      bgStyle: {
        image: getTofUrlLQ(`/bg/fulilingqu_bg_OS1.png`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default Matrices;
