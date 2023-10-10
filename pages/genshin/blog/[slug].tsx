import { BlogPost } from "@prisma/client";
import { GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import dynamic from "next/dynamic";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import remarkGfm from "remark-gfm";

import Metadata from "@components/Metadata";
import ArchiveRender from "@components/genshin/PostRender";
import useFormattedDate from "@hooks/use-formatted-date";
import { getImg } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { getPostBySlug } from "@pages/api/blog";

const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  posts: BlogPost;
  content: any;
};

export default function PostPage({ posts, content }: Props) {
  const dateFmtd = useFormattedDate(posts.updatedAt, {
    dateStyle: "full",
  });

  return (
    <article className="relative mx-auto max-w-screen-md">
      <div>
        <Link href="/genshin/blog" className="text-sm hover:text-white">
          Back to Blog
        </Link>
      </div>
      <header className="mx-2 lg:mx-0">
        <Metadata pageTitle={posts.title} pageDescription={posts.description} />
        <h1 className="my-6 text-4xl font-semibold text-gray-100">
          <Balancer>{posts.title}</Balancer>
        </h1>
        <p className="text-lg text-slate-200">{posts.description}</p>
        <div className="flex items-center justify-between">
          <a
            href={posts.authorLink}
            title={posts.authorName}
            className="px-sm-0 my-1 flex flex-wrap items-center gap-2 px-2"
          >
            <img
              src={getImg("gi", `/blog/author/${posts.authorAvatar}`, {
                height: 40,
                width: 40,
              })}
              alt={posts.authorName}
              className="rounded-full border-2 border-vulcan-900/80 p-px"
              width="40"
              height="40"
            />

            <span className="font-semibold text-slate-300">
              {posts.authorName}
            </span>
          </a>
          <FrstAds
            placementName="genshinbuilds_billboard_atf"
            classList={["flex", "justify-center"]}
          />
          <div className="mt-1 pr-2 text-sm italic">
            <span data-time={posts.updatedAt}>{dateFmtd}</span>
          </div>
        </div>
      </header>

      <section className="prose prose-invert card mt-0 max-w-none">
        <img
          alt={posts.title}
          src={getImg("gi", `/blog/${posts.image}`)}
          className="mx-auto rounded-lg text-center"
        />
        <ArchiveRender {...content} />
      </section>
    </article>
  );
}
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params!;

  const posts = await getPostBySlug(slug as string);

  if (!posts) {
    return {
      notFound: true,
    };
  }

  const lngDict = await getLocale(ctx.locale!, "genshin");

  const content = await serialize(posts.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  const image = getImg("gi", `/blog/${posts.image}`, {
    quality: 50,
  });

  return {
    props: {
      posts,
      content,
      lngDict,
      bgStyle: {
        image,
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.5),rgb(26, 29, 39) 620px)",
        },
      },
    },
    // enable ISR
    revalidate: 60 * 60 * 24, // Once a day
  };
};
