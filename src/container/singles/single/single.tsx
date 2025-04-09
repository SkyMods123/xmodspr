import React, { FC } from 'react';
import Head from 'next/head';
import Tag from '@/components/Tag/Tag';
import NcImage from '@/components/NcImage/NcImage';
import { getPostDataFromPostFragment } from '@/utils/getPostDataFromPostFragment';
import SingleHeader from '../SingleHeader';
import { FragmentTypePostFullFields } from '@/container/type';
import PostCardMeta from '@/components/PostCardMeta/PostCardMeta';
import useGetPostsNcmazMetaByIds from "@/hooks/useGetPostsNcmazMetaByIds";
import { gql, useQuery } from '@apollo/client';
import { TPostCard } from '@/components/Card2/Card2';
import SingleRelatedPosts from '@/container/singles/SingleRelatedPosts';
import { GET_RELATED_POSTS } from '@/container/singles/single/related';

export interface SingleType1Props {
    post: FragmentTypePostFullFields;
    showRightSidebar?: boolean;
}

const SingleType1: FC<SingleType1Props> = ({ post, showRightSidebar }) => {
    const {
        title,
        content,
        date,
        author,
        databaseId,
        tags,
        excerpt,
        featuredImage,
        ncPostMetaData,
    } = getPostDataFromPostFragment(post || {});

    // Fetch related posts
    const { data: relatedPostsData, loading, error } = useQuery(GET_RELATED_POSTS, {
      variables: { databaseId: Number(databaseId) },
      skip: !databaseId
    });

    const relatedPosts = relatedPostsData?.posts?.nodes || [];

    // Hook za meta podatke
    const { loading: loadingRelatedMeta } = useGetPostsNcmazMetaByIds({
        posts: relatedPosts as TPostCard[]
    });

    const hasFeaturedImage = !!featuredImage?.sourceUrl;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="bg-background __className_3a0388 min-h-screen">
                <div className="coverimg absolute -top-[380px] hidden h-[50rem] w-full opacity-30 blur-[2px] md:block">
                    <img
                        fetchPriority="high"
                        loading="eager"
                        width="135"
                        height="160"
                        decoding="async"
                        data-nimg="1"
                        className="h-[800px] w-full object-cover object-top"
                        style={{ color: 'transparent' }}
                    />
                </div>
                <div className="absolute -top-[370px] hidden h-[50rem] w-full md:block"></div>
                <div className="min-h-screen bg-background">
                    <main className="container px-4 py-6 lg:px-14">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="z-10 space-y-6 lg:col-span-2">
                                <header className="!mt-0">
                                    <div className="rounded-lg border text-card-foreground shadow-sm bg-card/70 backdrop-blur-sm">
                                        <div className="flex flex-col space-y-1.5 p-6 pb-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <img
                                                            alt="Game icon"
                                                            loading="lazy"
                                                            width="32"
                                                            height="32"
                                                            decoding="async"
                                                            data-nimg="1"
                                                            className="flex-shrink-0 rounded-lg"
                                                            style={{ color: 'transparent' }}
                                                        />
                                                        <div className="min-w-0">
                                                            <div className="text-2xl font-semibold leading-none tracking-tight">
                                                                <h2 className="text-neutral-900 truncate text-xl font-bold sm:text-2xl dark:text-neutral-100">{title}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <PostCardMeta
                                                        className="text-sm"
                                                        meta={{ date, author }}
                                                        hiddenAvatar={false}
                                                        avatarSize="h-7 w-7 text-sm"
                                                    />
                                                    <a
                                                        aria-label="Search for game"
                                                        className="hover:text-green-500 hover:underline"
                                                        href="https://rscripts.net/scripts?q=Dead%20Rails%20Alpha"
                                                    >
                                                    </a>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-clock h-3.5 w-3.5"
                                                        >
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <polyline points="12 6 12 12 16 14"></polyline>
                                                        </svg>
                                                        2 days ago
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0">
                                            <div className="flex flex-col gap-6 lg:flex-row">
                                                <div className="group relative w-full overflow-hidden rounded-lg lg:w-7/12">
                                                    <img
                                                        src={featuredImage?.sourceUrl || ''}
                                                        width="640"
                                                        height="360"
                                                        fetchPriority="high"
                                                        loading="eager"
                                                        decoding="async"
                                                        data-nimg="1"
                                                        className="aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                                                        style={{ color: 'transparent' }}
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-between gap-4 lg:w-5/12">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <a className="flex items-center gap-2" href="https://rscripts.net/@0x256">
                                                                <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-foreground hover:text-primary">
                                                                    viewCount
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            className="inline-flex items-center transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:text-accent-foreground h-10 px-4 py-2 col-span-2 transition-colors duration-200 hover:bg-accent"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-download h-4 w-4"
                                                                >
                                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                                    <line x1="12" x2="12" y1="15" y2="3"></line>
                                                                </svg>
                                                                Download
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </header>
                                <section className="script-description">
                                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <div className="flex flex-col space-y-1.5 p-6">
                                            <div className="text-2xl font-semibold leading-none tracking-tight">
                                                <h2>Description</h2>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <h2 className="description prose prose-invert max-w-none text-neutral-900 dark:text-neutral-100">{excerpt || ''}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <aside className="script-similar-scripts lg:col-span-1">
                                <div className="rounded-lg border text-card-foreground shadow-sm sticky top-15 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:w-[400px] h-[900px] ">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-3">
                                      <SingleRelatedPosts
                                        posts={relatedPosts}
                                        postDatabaseId={databaseId}
                                      />
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default SingleType1;
