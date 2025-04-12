import React, { FC } from "react";
import { PostDataFragmentType } from "@/data/types";
import Card9 from "@/components/Card9/Card9"; // Importamo Card9 komponentu

export interface SingleRelatedPostsProps {
  postDatabaseId: number;
  posts: PostDataFragmentType[] | null;
}

const SingleRelatedPosts2: FC<SingleRelatedPostsProps> = ({
  postDatabaseId,
  posts,
}) => {
  if (!posts?.length) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      {posts.map((post, index) => (
        <div key={post.databaseId || index} className="mb-4 last:mb-0">
          <Card9 
            post={post}
            ratio="aspect-w-16 aspect-h-9"
            className="lg:w-[350px] lg:h-[190px] sm:h-[auto] md:h-[190px]" // Za minimalnu i fiksnu visinu
          />
        </div>
      ))}
    </div>
  );
};

export default SingleRelatedPosts2;
