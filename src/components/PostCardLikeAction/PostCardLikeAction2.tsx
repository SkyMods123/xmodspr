'use client'

import { FC, useEffect, useMemo, useState } from 'react'
import convertNumbThousand from '@/utils/convertNumbThousand'
import { useMutation } from '@apollo/client'
import { NC_MUTATION_UPDATE_USER_REACTION_POST_COUNT } from '@/fragments/mutations'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import {
	NcmazFcUserReactionPostActionEnum,
	NcmazFcUserReactionPostNumberUpdateEnum,
	NcmazFcUserReactionPostUpdateResuiltEnum,
} from '@/__generated__/graphql'
import { updateViewerAllReactionPosts } from '@/stores/viewer/viewerSlice'
import { useLoginModal } from '@/hooks/useLoginModal'

import toast from 'react-hot-toast'
import { FavouriteIcon } from '../Icons/Icons'

export interface PostCardLikeActionProps {
	className?: string
	sizeClassName?: string
	likeCount: number
	postDatabseId: number
}

const PostCardLikeAction2: FC<PostCardLikeActionProps> = ({
	className = '',
	sizeClassName = '',
	likeCount: likeCountProp = 34,
	postDatabseId,
}) => {
	const [likeCountState, setLikeCountState] = useState(likeCountProp)
	const { openLoginModal } = useLoginModal()
	//
	const [handleUpdateReactionCount, { loading, error, data, called }] =
		useMutation(NC_MUTATION_UPDATE_USER_REACTION_POST_COUNT)
	//
	const { viewer, viewerReactionPosts, authorizedUser } = useSelector(
		(state: RootState) => state.viewer,
	)
	const likesCountOkFromStore = useSelector(
		(state: RootState) =>
			state.postsNcmazMetaDataOk[postDatabseId]?.ncPostMetaData?.likesCount,
	)
	const dispatch = useDispatch()

	const { isAuthenticated, isReady } = authorizedUser

	//
	useEffect(() => {
		if (likesCountOkFromStore == undefined || likesCountOkFromStore == null) {
			return
		}

		setLikeCountState(likesCountOkFromStore || 0)
	}, [likesCountOkFromStore])

	// handle dispatch update viewer reaction posts
	const handleDispatchUpdateViewerReactionPosts = (
		postDatabseId: number,
		type?: NcmazFcUserReactionPostUpdateResuiltEnum | null,
		number?: NcmazFcUserReactionPostNumberUpdateEnum | null,
	) => {
		let newViewerReactionPosts = viewerReactionPosts

		// neu type === Added -> them vao list binh thuong
		if (type === NcmazFcUserReactionPostUpdateResuiltEnum.Added) {
			newViewerReactionPosts = [
				...(viewerReactionPosts || []).filter(
					(post) => !post.title?.includes(`${postDatabseId},LIKE`),
				),
				{
					title: `${postDatabseId},LIKE`,
					id: String(new Date()),
					isNewAddedFromClient: true,
					newLikedCount: likeCountState + 1,
				},
			]

			// update like count
			setLikeCountState(likeCountState + 1)
		}

		if (type === NcmazFcUserReactionPostUpdateResuiltEnum.Removed) {
			// neu type === Remove -> xoa khoi list binh thuong
			newViewerReactionPosts = (viewerReactionPosts || []).map((post) => {
				if (!post.title?.includes(`${postDatabseId},LIKE`)) {
					return post
				} else {
					return {
						...post,
						isNewAddedFromClient: false,
						isNewUnLikeFromClient: true,
						newLikedCount: likeCountState > 0 ? likeCountState - 1 : 0,
					}
				}
			})
			// update like count
			setLikeCountState(likeCountState > 0 ? likeCountState - 1 : 0)
		}

		if (type === NcmazFcUserReactionPostUpdateResuiltEnum.Error) {
			// neu type === Error -> kiem tra xem hanh dong nay la dang remove hay add,
			// vi la Error nen se phai thuc hien nguoc lai voi hanh dong truoc do, vi truoc do da thuc hien dispatch tam 1 lan len redux roi
			// neu la remove -> them lai vao list.
			if (number === NcmazFcUserReactionPostNumberUpdateEnum.Remove_1) {
				newViewerReactionPosts = [
					...(viewerReactionPosts || []).filter(
						(p) => !p.title?.includes(`${postDatabseId},LIKE`),
					),
					{
						title: `${postDatabseId},LIKE`,
						id: String(new Date()),
					},
				]
				// update like count
				setLikeCountState(likeCountState + 1)
			}
			// Neu la add -> xoa khoi list
			if (number === NcmazFcUserReactionPostNumberUpdateEnum.Add_1) {
				newViewerReactionPosts = (viewerReactionPosts || []).filter(
					(post) => !post.title?.includes(`${postDatabseId},LIKE`),
				)

				// update like count
				setLikeCountState(likeCountState > 0 ? likeCountState - 1 : 0)
			}
		}

		dispatch(updateViewerAllReactionPosts(newViewerReactionPosts))
	}
	//

	// check is isLiked
	const isLiked = useMemo(() => {
		// for user logged in
		return viewerReactionPosts?.some(
			(post) =>
				post.title?.trim() == `${postDatabseId},LIKE` &&
				!post.isNewUnLikeFromClient,
		)
	}, [viewer, viewerReactionPosts])
	//

	// handle update viewerReactionPosts to redux store
	useEffect(() => {
		if (loading || !isReady) {
			return
		}

		if (
			error ||
			data?.ncmazFaustUpdateUserReactionPostCount?.result ===
				NcmazFcUserReactionPostUpdateResuiltEnum.Error
		) {
			console.log('___NcBookmark___error', { error, data })
			toast.error('An error occurred, please try again later.')
			// dispatch update viewer reaction posts -> when update have error
			handleDispatchUpdateViewerReactionPosts(
				postDatabseId,
				NcmazFcUserReactionPostUpdateResuiltEnum.Error,
				data?.ncmazFaustUpdateUserReactionPostCount?.number,
			)
			return
		}
	}, [data, error, loading, isReady])

	// handle click like action
	const handleClickAction = () => {
		if (!isReady) {
			toast.error('Please wait a moment, data is being prepared.')
			return
		}

		if (isAuthenticated === false) {
			openLoginModal()
			return
		}

		if (!viewer?.databaseId) {
			toast.error('Please wait a moment, data is being prepared.')
			return
		}

		// check isload like count from server
		const loadingDOM = document.querySelectorAll(
			'.getPostsNcmazMetaByIds_is_loading',
		)
		if (!!loadingDOM?.length) {
			toast.error('Please wait a moment, data is being refreshed.')
			return
		}

		// dispatch pre update viewer reaction posts -> when prepare update to server. Will have a update again when have result from server
		handleDispatchUpdateViewerReactionPosts(
			postDatabseId,
			isLiked
				? NcmazFcUserReactionPostUpdateResuiltEnum.Removed
				: NcmazFcUserReactionPostUpdateResuiltEnum.Added,
		)

		//  update like count for database
		handleUpdateReactionCount({
			variables: {
				post_id: postDatabseId,
				user_id: viewer.databaseId,
				reaction: NcmazFcUserReactionPostActionEnum.Like,
				number: isLiked
					? NcmazFcUserReactionPostNumberUpdateEnum.Remove_1
					: NcmazFcUserReactionPostNumberUpdateEnum.Add_1,
			},
		})
	}

	// handle update like count when have update from store
	const actualLikeCount = useMemo(() => {
		if (!viewerReactionPosts?.length) {
			return likeCountState
		}
		const viewerReactionPost = viewerReactionPosts?.find(
			(post) => post.title?.trim() == `${postDatabseId},LIKE`,
		)
		if (typeof viewerReactionPost?.newLikedCount === 'number') {
			return viewerReactionPost?.newLikedCount
		}
		return likeCountState
	}, [likeCountState, viewerReactionPosts])

	return (
		<button
			className={`nc-PostCardLikeAction group/PostCardLikeAction relative flex items-center text-xs leading-none transition-colors ${className} ${
				isLiked
					? 'text-rose-600 dark:text-rose-500'
					: 'text-neutral-700 hover:text-rose-600 dark:text-neutral-200 dark:hover:text-rose-400'
			} `}
			onClick={handleClickAction}
			title={isLiked ? 'Unlike' : 'Like this post'}
		>
			<div
				className={`${sizeClassName} flex flex-shrink-0 items-center justify-center rounded-full transition-colors duration-75 ${
					isLiked
						? ''
						: ''
				}`}
			>
				<FavouriteIcon
					color={'currentColor'}
					fill={isLiked ? 'currentColor' : 'none'}
					className="h-[18px] w-[18px]"
				/>
			</div>

			<span
				className={`ml-[0px] min-w-[1.125rem] flex-shrink-0 text-start transition-colors duration-75 ${
					isLiked
						? 'text-rose-600 dark:text-rose-500 ml-[0px]'
						: 'text-neutral-900 dark:text-neutral-200 ml-[0px]'
				}`}
			>
				{actualLikeCount ? convertNumbThousand(actualLikeCount) : 0}
			</span>
		</button>
	)
}

export default PostCardLikeAction2
