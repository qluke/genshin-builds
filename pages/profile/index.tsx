import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

import Metadata from "@components/Metadata";
import Button from "@components/ui/Button";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getLocale } from "@lib/localData";
import { updateFavorites } from "@state/profiles-fav";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const ProfileFavorites = dynamic(
  () => import("@components/genshin/ProfileFavorites"),
  { ssr: false }
);

function ProfileIndex() {
  const [uuid, setUuid] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useIntl("profile");
  const router = useRouter();

  const onSubmit = () => {
    setIsLoading(true);
    setError(null);
    fetch("/api/submit_uuid?uid=" + uuid, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.uuid) {
          updateFavorites(json);
          router.push(`/profile/${uuid}`);
        } else {
          setError(json.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Profiles",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Get the best Genshin Impact profiles to optimize your gameplay. Visualize and compare your player profile with others, calculate crit value, and find the best characters and artifacts.",
        })}
      />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <ProfileFavorites />
      <div className="card flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        ) : null}
        {error ? <div className="py-4 text-red-500">{error}</div> : null}
        <input
          placeholder="Your UUID"
          className="mb-4 w-full max-w-xl rounded p-2"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
        />
        <Button onClick={onSubmit} disabled={isLoading}>
          {t({ id: "submit", defaultMessage: "Submit" })}
        </Button>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");

  return {
    props: {
      lngDict,
    },
  };
};

export default ProfileIndex;
