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
import SingleRelatedPosts2 from '@/container/singles/SingleRelatedPosts2';
import { GET_RELATED_POSTS } from '@/container/singles/single/related';
import PostCardLikeAndComment from '@/components/PostCardLikeAndComment/PostCardLikeAndComment'
import NcBookmark3 from '@/components/NcBookmark/NcBookmark3'
import PostCardLikeAction2 from '@/components/PostCardLikeAction/PostCardLikeAction2'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import SocialsShareDropdown from '@/components/SocialsShareDropdown/SocialsShareDropdown'
import PostActionDropdown from '@/components/PostActionDropdown/PostActionDropdown'
import SingleCommentWrap from '@/container/singles/SingleCommentWrap'
import ncFormatDate from '@/utils/formatDate'
import convertNumbThousand from '@/utils/convertNumbThousand'

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
	categories,
	commentCount,
        commentStatus,
	uri,
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

    const hasFeaturedImage = !!featuredImage?.sourceUrl;

    return (
        <>
            <div className="bg-background __className_3a0388 min-h-screen">
                <div className="absolute -top-[370px] hidden h-[50rem] w-full md:block"></div>
                <div className="min-h-screen bg-background">
                    <main className="container px-4 py-6 lg:px-14">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="z-10 space-y-6 lg:col-span-2">
                                <header className="!mt-0">
                                    <div className="rounded-lg border text-card-foreground shadow-sm bg-card/70 backdrop-blur-sm">
                                        <div className="flex flex-col space-y-1.5 p-6 pb-4 pt-[16px]">
                                            <div className="flex flex-col gap-1">
						    <CategoryBadgeList
								itemClass="!px-3"
								categories={categories?.nodes || []}
							    	className="h-6"
							/>
                                                <div className="flex items-center justify-between gap-3 mt-[5px]">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="min-w-0">
                                                            <div className="text-2xl font-semibold leading-none tracking-tight">
                                                                <h2 className="text-neutral-900 truncate text-xl font-bold sm:text-2xl dark:text-neutral-100">{title}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
							<svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className=" h-4 w-4"
                                                                >
							    	    <path d="M19 3h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H8V2c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V8h14v10c0 .55-.45 1-1 1zM8 10h3c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1v-3c0-.55.45-1 1-1z"></path>
							</svg>
							<h2 className="min-w-[1.125rem] flex-shrink-0 text-start text-neutral-900 transition-colors duration-75 dark:text-neutral-200">Publication date: {ncFormatDate(date || '')}</h2>
							<span className="mx-[6px] font-medium text-neutral-500 dark:text-neutral-400">
								·
							</span>
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
                                                                    className=" h-4 w-4"
                                                                >
                                                                    <path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"></path>
							    	    <path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"></path>
							</svg>
                                                        <h2 className="min-w-[1.125rem] flex-shrink-0 text-start text-neutral-900 transition-colors duration-75 dark:text-neutral-200">{convertNumbThousand(ncPostMetaData?.viewsCount || 1)}</h2>
                                                    </div>
						        <span className="mx-[6px] font-medium text-neutral-500 dark:text-neutral-400">
								·
							</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0">
                                            <div className="flex flex-col gap-6 lg:flex-row">
                                                <div className="group relative w-full overflow-hidden rounded-xl lg:w-7/12">
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
                                                            <a className="flex items-center gap-2">
								    <PostCardMeta
                                                        		className="text-sm"
                                                        		meta={{ author }}
                                                       	 		hiddenAvatar={false}
                                                        		avatarSize="h-10 w-10 text-sm"
                                                    		    />
                                                            </a>
							    <a className="flex items-center gap-2">
								    <PostActionDropdown
									containerClassName="h-9 w-9 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
									iconClass="h-5 w-5"
									post={post}
									isSingle
								    />
								    <SocialsShareDropdown />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
							    <NcBookmark3
								postDatabseId={databaseId}
								containerClassName="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 border border-input"
							/>
							    <PostCardLikeAction2
								likeCount={ncPostMetaData?.likesCount || 0}
								postDatabseId={databaseId}
								className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 border border-input rounded-full"
							/>
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
				<section className="script-description">
                                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <div className="flex flex-col space-y-1.5 p-6">
                                            <div className="text-2xl font-semibold leading-none tracking-tight">
                                                <h2 className="text-2xl font-semibold leading-none tracking-tight">Comments ({commentCount})</h2> 
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-4">
                                            <div className="flex flex-col gap-2">
						    {commentStatus === 'open' ? (
								<div
									id="comments"
									className="scroll-mt-10 sm:scroll-mt-20"
								>
									<SingleCommentWrap
										commentCount={commentCount || 0}
										postDatabaseId={databaseId}
									/>
								</div>
						   ) : null}					    
					    </div>
                                        </div>
                                    </div>
                                </section>
				<section className="script-description">
                                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <div className="flex flex-col space-y-1.5 p-6">
                                            <div className="text-2xl font-semibold leading-none tracking-tight">
                                                <h2>Tags</h2>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 space-y-4">
                                            <div className="flex flex-col gap-2">
                                                {/* TAGS */}
						{tags?.nodes?.length ? (
							<div className="flex-wrap">
								{tags.nodes.map((item) => (
									<Tag
										hideCount
										key={item.databaseId}
										name={'#' + (item.name || '')}
										uri={item.uri || ''}
										className="mb-2 me-2 border border-neutral-200 dark:border-neutral-800"
									/>
								))}
							</div>
						) : null}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <aside className="script-similar-scripts lg:col-span-1">
                                <div className="rounded-lg border text-card-foreground shadow-sm sticky top-15 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:w-[400px] h-[auto] pb-[15px] lg:h-[860px]">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-3">
                                      <SingleRelatedPosts2
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
