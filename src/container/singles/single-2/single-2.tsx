import React, { FC } from "react";
import NcImage from "@/components/NcImage/NcImage";
import { getPostDataFromPostFragment } from "@/utils/getPostDataFromPostFragment";
import SingleHeader from "../SingleHeader";
import { SingleType1Props } from "../single/single";
import { GET_RELATED_POSTS } from '@/container/singles/single/related';
import { gql, useQuery } from '@apollo/client';
import useGetPostsNcmazMetaByIds from "@/hooks/useGetPostsNcmazMetaByIds";
import { TPostCard } from '@/components/Card2/Card2';

export const GET_VERIFIED_USERS = gql`
  query GetVerifiedUsers {
    users {
      nodes {
        id
        name
        isVerified
      }
    }
  }
`;

interface Props extends SingleType1Props {}

const SingleType2: FC<Props> = ({ post }) => {
  //
  const {
    title,
    content,
    date,
    author,
    databaseId,
    excerpt,
    featuredImage,
    ncPostMetaData,
  } = getPostDataFromPostFragment(post || {});
  
  // Fetch related posts
  const { data: relatedPostsData, loading, error } = useQuery(GET_RELATED_POSTS, {
    variables: { databaseId: Number(databaseId) },
    skip: !databaseId
  });

  const relatedPosts = (relatedPostsData?.posts?.nodes || []).slice(0, 4);

  // Hook za meta podatke
  const { loading: loadingRelatedMeta } = useGetPostsNcmazMetaByIds({
    posts: relatedPosts as TPostCard[]
  });

  const imgWidth = featuredImage?.mediaDetails?.width || 1000;
  const imgHeight = featuredImage?.mediaDetails?.height || 750;

  // Provera da li je autor verifikovan
  const isVerified = author?.node?.isVerified;

  return (
    <div className={`pt-8 lg:pt-16`}>
      {/* SINGLE HEADER */}
      <header className="container rounded-xl">
        <div className="max-w-screen-md mx-auto">
          <SingleHeader post={{ ...post }} hiddenDesc />
          {!featuredImage?.sourceUrl && (
            <div className="my-5 border-b border-neutral-200 dark:border-neutral-800"></div>
          )}
          {/* Prikaz "Verifikovan" natpisa ako je autor verifikovan */}
          {isVerified && (
            <div className="text-center text-green-500 font-semibold text-lg mt-4">
              Verifikovan korisnik
            </div>
          )}
        </div>
      </header>

      <SingleRelatedPosts2
        posts={relatedPosts}
        postDatabaseId={databaseId}
      />

      {/* FEATURED IMAGE */}
      {featuredImage?.sourceUrl && (
        <NcImage
          alt={title}
          containerClassName="container my-10 sm:my-12"
          className={`rounded-xl mx-auto ${
            imgWidth <= 768 && ncPostMetaData?.showRightSidebar
              ? "w-full max-w-screen-md"
              : ""
          }`}
          src={featuredImage?.sourceUrl || ""}
          width={imgWidth}
          height={imgHeight}
          sizes={"(max-width: 1024px) 100vw, 1280px"}
          enableDefaultPlaceholder
          priority
        />
      )}
    </div>
  );
};

export default SingleType2;
