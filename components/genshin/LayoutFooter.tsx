import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import { AiOutlineTwitter } from "react-icons/ai";

const LayoutFooter = () => {
  const router = useRouter();
  return (
    <footer
      className="border-t border-gray-700 border-opacity-50 bg-vulcan-800/90 px-4 py-6 text-gray-400 backdrop-blur md:px-20 md:py-14"
      style={{ zIndex: 1 }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-2 text-gray-200 text-lg">GenshinBuilds</h4>
            <Link href="/privacy-policy" className="my-1 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/contact" className="my-1 hover:text-white">
              Contact
            </Link>
            <Link href="/changelog" className="my-1 hover:text-white">
              Changelog
            </Link>
            <a
              href="https://twitter.com/genshin_builds"
              target="_blank"
              rel="noopener noreferrer"
              className="group my-1 text-lg"
            >
              <AiOutlineTwitter className="inline group-hover:text-blue-400" />{" "}
              <span className="text-base">Twitter</span>
            </a>
          </div>
          <div className="flex flex-1 flex-col">
            <Link href={router.asPath} locale="en" className="my-2">
              English
            </Link>
            <Link href={router.asPath} locale="es" className="my-2">
              Español
            </Link>
            <Link href={router.asPath} locale="ja" className="my-2">
              日本語
            </Link>
            <Link href={router.asPath} locale="zh-tw" className="my-2">
              中文（繁體）
            </Link>
            <Link href={router.asPath} locale="de" className="my-2">
              Deutsch
            </Link>
            <Link href={router.asPath} locale="fr" className="my-2">
              Français
            </Link>
            <Link href={router.asPath} locale="it" className="my-2">
              Italiano
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <Link href={router.asPath} locale="id" className="my-2">
              Indonesia
            </Link>
            <Link href={router.asPath} locale="ko" className="my-2">
              한국어
            </Link>
            <Link href={router.asPath} locale="pt" className="my-2">
              Português
            </Link>
            <Link href={router.asPath} locale="ru" className="my-2">
              Pусский
            </Link>
            <Link href={router.asPath} locale="th" className="my-2">
              ภาษาไทย
            </Link>
            <Link href={router.asPath} locale="tr" className="my-2">
              Türkçe
            </Link>
            <Link href={router.asPath} locale="vi" className="my-2">
              Tiếng Việt
            </Link>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              GenshinBuilds is a Database, Tier List, and Guide for Genshin
              Impact on PC, mobile and consoles.
            </p>
            <p className="mt-3 text-sm">
              GenshinBuilds is not endorsed by miHoYo Co Ltd. and does not
              reflect the views or opinions of MiHoyo or anyone officially
              involved in producing or managing Genshin Impact.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(LayoutFooter);
