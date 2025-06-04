'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Button } from '@/app/ui/components/Button';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { engage } from '@/app/ui/components/Card/utils';
import platformApi, { engageApi } from '@/app/lib/data/platform-api';
import Link from '@/app/ui/components/Link'

interface Props {
	id: number;
	padtype: string;
	title: string;
	owner: string;
	lab: string | undefined;
	vignette?: string;
	tags: string[];
	tagStyle: string;
	tagStyleShade: string;
	color: string;
	platform?: string;
	pinboards?: any[];
	current_user_engagement?: any[];
	engagement?: any[];
	contributor_id?: string;
}

export default function Hero({
	id,
	padtype,
	title,
	owner,
	lab,
	vignette,
	tags,
	tagStyle,
	tagStyleShade,
	color,
	platform,
	pinboards = [],
	current_user_engagement,
	engagement,
	contributor_id
}: Props) {
	if (padtype === 'solution') padtype = 'solution note';
	padtype = `${padtype?.slice(0, 1).toUpperCase()}${padtype?.substring(1)}`;
	let labLink: string = '';
	if (lab) {
		if (lab.includes('Global')) {
			labLink = 'https://www.undp.org/acceleratorlabs/';
		} else
			labLink = `https://www.undp.org/acceleratorlabs/${lab?.toLowerCase().replace(/\s/g, '-')}`; // FORMAT: undp-algeria-accelerator-lab
	}

	const { setSharedState, sharedState } = useSharedState();
	const { isLogedIn } = sharedState || {};

	const showAddToBoardModal = () => {
		setSharedState((prevState: any) => ({
			...prevState,
			addToBoard: {
				showAddToBoardModal: true,
				platform,
				id,
				pinboards,
			},
		}));
	};

	const hasEngagement = (type: string) =>
		!!current_user_engagement?.some((p: any) => p.type === type);

	const [isLiked, setIsLiked] = useState<boolean>(hasEngagement('like'));
	const [isDisliked, setIsDisliked] = useState<boolean>(
		hasEngagement('dislike')
	);
	const [hrefs, setHref] = useState<string>('');

	let likes: number =
		engagement?.find((d: any) => d.type === 'like')?.count ?? 0;
	let dislikes: number =
		engagement?.find((d: any) => d.type === 'dislike')?.count ?? 0;
	const comments: number =
		engagement?.find((d: any) => d.type === 'comment')?.count ?? 0;

	const [likeCounts, setLikeCounts] = useState<number>(
		engagement?.find((d: any) => d.type === 'like')?.count ?? 0
	);
	const [dislikeCounts, setDislikeCounts] = useState<number>(
		engagement?.find((d: any) => d.type === 'dislike')?.count ?? 0
	);

	type Notification = string | undefined;

	const showNotification = (
		message: Notification = 'Action Required!',
		submessage: Notification = 'You need to log in to engage with this post.',
		messageType: Notification = 'warning'
	) => {
		setSharedState((prevState: any) => ({
			...prevState,
			notification: {
				showNotification: true,
				message,
				submessage,
				messageType,
			},
		}));
	};

	type EngagementType = 'like' | 'dislike';
	type ActionType = 'delete' | 'insert';

	const handleEngage = async (action: ActionType, type: EngagementType) => {
		if (!isLogedIn) return showNotification();
		return engage(
			action,
			type,
			platform as string,
			id,
			engageApi,
			setIsLiked,
			setIsDisliked,
			likeCounts,
			setLikeCounts,
			dislikeCounts,
			setDislikeCounts
		);
	};

	useEffect(() => {
		const fetchHref = async () => {
			const url = await platformApi(
				{ render: true, action: 'download', pads: [id] },
				platform as string,
				'pads',
				true
			);
			setHref(url);
		};
		fetchHref();
	}, []);

	return (
		<section className="home-section grid-bg relative overflow-hidden !border-t-0 pb-[40px] pt-[140px] lg:pb-[80px] lg:pt-0">
			<div className="inner xxl:w-[1440px] mx-auto w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px]">
				<div className="section-content xxl:px-[80px] grid grid-cols-9 gap-[20px] px-[20px] pt-[40px] lg:px-[80px] lg:pt-[80px] xl:px-[40px]">
					<div className="c-left col-span-9 md:col-span-5 lg:col-span-5 lg:mb-[60px] lg:mt-[80px]">
						<span className={clsx('slanted-bg full', color)}>
							<span>
								<b>{padtype}</b>
							</span>
						</span>
						<h2>{title}</h2>
						<p className="lead mb-[10px]">
							<Link
								href={`/profile/${contributor_id}`}
								className="hover:text-blue-800 underline font-bold"
							>
								<b>Posted by {owner}</b>
							</Link>
						</p>
						{lab === undefined ? null : (
							<a
								href={labLink}
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								{lab}
							</a>
						)}
						<div className="mb-[20px] mt-[40px] flex flex-row flex-wrap gap-1.5">
							{tags?.map((d: any, i: number) => {
								return (
									<button className={clsx('chip', tagStyleShade)} key={i}>
										{d}
									</button>
								);
							})}
						</div>

						{/* Engagement */}
						{!isLogedIn ? null : (
							<div className="mb-[10px] flex flex-row items-center px-5 text-sm">
								<div className="flex flex-row items-center">
									<button
										onClick={() =>
											handleEngage(isLiked ? 'delete' : 'insert', 'like')
										}
										className={clsx(
											'flex flex-row items-start justify-start bg-inherit hover:text-light-green',
											isLiked ? 'text-red-300' : ''
										)}
									>
										<svg
											width="21"
											height="21"
											viewBox="0 0 21 21"
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M3.41018 20.8351V8.90118H0.000488281V20.8351H3.41018Z"
												fill="currentColor"
											/>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M8.52471 5.89395L6.81987 9.30364V19.1302H15.9953L18.7538 13.6133V9.7536C18.7538 9.28282 18.3721 8.90118 17.9014 8.90118H10.2296V2.93422C10.2296 2.46344 9.84791 2.0818 9.37714 2.0818H8.52471V5.89395ZM6.81987 0.376953H9.37714C10.7895 0.376953 11.9344 1.52188 11.9344 2.93422V7.19633H17.9014C19.3137 7.19633 20.4586 8.34126 20.4586 9.7536V14.0157L17.0489 20.8351H5.11502V8.90118L6.81987 5.49149V0.376953Z"
												fill="currentColor"
											/>
										</svg>
									</button>
									<p className="mb-0 font-space-mono">
										<b>{likeCounts}</b>
									</p>
									<button
										onClick={() =>
											handleEngage(isDisliked ? 'delete' : 'insert', 'dislike')
										}
										className={clsx(
											'ml-[5px] mt-[10px] flex flex-row items-start justify-start bg-inherit hover:text-light-green',
											isDisliked ? 'text-red-300' : ''
										)}
									>
										<svg
											width="21"
											height="21"
											viewBox="0 0 21 21"
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M17.5063 0.3778L17.5063 12.3117L20.916 12.3117L20.916 0.3778L17.5063 0.3778Z"
												fill="currentColor"
											/>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12.3918 15.3189L14.0966 11.9093L14.0966 2.08264L4.92122 2.08264L2.16272 7.59964L2.16272 11.4593C2.16272 11.9301 2.54437 12.3117 3.01515 12.3117L10.6869 12.3117L10.6869 18.2787C10.6869 18.7494 11.0686 19.1311 11.5394 19.1311L12.3918 19.1311L12.3918 15.3189ZM14.0966 20.8359L11.5394 20.8359C10.127 20.8359 8.9821 19.691 8.9821 18.2787L8.9821 14.0166L3.01514 14.0166C1.6028 14.0166 0.457879 12.8716 0.457879 11.4593L0.457879 7.19718L3.86757 0.377798L15.8015 0.3778L15.8015 12.3117L14.0966 15.7214L14.0966 20.8359Z"
												fill="currentColor"
											/>
										</svg>
									</button>
									<p className="mb-0 font-space-mono">
										<b>{dislikeCounts}</b>
									</p>
								</div>

								<div className="flex cursor-pointer items-end justify-items-end px-5">
									<a
										href={hrefs}
										target="_blank"
										className="flex h-[40px] w-[40px] items-center justify-center border-[1px] border-solid border-black bg-[transparent] text-center"
									>
										<svg
											width="21"
											height="17"
											viewBox="0 0 21 17"
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g clipPath="url(#clip0_3109_16003)">
												<path
													d="M10.2033 0.210938C9.69608 0.210938 9.2811 0.630688 9.2811 1.14372V9.65531L7.52435 7.87837C7.34453 7.69648 7.11398 7.6032 6.87422 7.6032C6.63906 7.6032 6.40391 7.69648 6.22408 7.87837C5.86443 8.24216 5.86443 8.82514 6.22408 9.18892L9.50703 12.5283C9.69147 12.7148 9.94046 12.8081 10.1848 12.8034C10.1894 12.8034 10.1941 12.8034 10.1987 12.8034C10.2033 12.8034 10.2079 12.7894 10.2125 12.7894C10.4615 12.7988 10.7013 12.7195 10.8903 12.5283L14.1733 9.18892C14.5329 8.82514 14.5329 8.24216 14.1733 7.87837C13.9934 7.69648 13.7629 7.6032 13.5231 7.6032C13.288 7.6032 13.0528 7.69648 12.873 7.87837L11.1162 9.65531V1.14372C11.1162 0.630688 10.7013 0.210938 10.1941 0.210938H10.2033ZM0.981504 10.4435C0.474306 10.4435 0.0593262 10.8633 0.0593262 11.3763V14.2026C0.0593262 15.7464 1.29965 17.0009 2.82586 17.0009H17.5807C19.1069 17.0009 20.3472 15.7464 20.3472 14.2026V11.3763C20.3472 10.8633 19.9322 10.4435 19.4251 10.4435C18.9179 10.4435 18.5029 10.8633 18.5029 11.3763V14.2026C18.5029 14.7156 18.0879 15.1354 17.5807 15.1354H2.82586C2.31866 15.1354 1.90368 14.7156 1.90368 14.2026V11.3763C1.90368 10.8633 1.4887 10.4435 0.981504 10.4435Z"
													fill="currentColor"
												/>
											</g>
											<defs>
												<clipPath id="clip0_3109_16003">
													<rect
														width="20.2879"
														height="16.79"
														fill="currentColor"
														transform="translate(0.0593262 0.210938)"
													/>
												</clipPath>
											</defs>
										</svg>
									</a>
								</div>

								<Button
									className={clsx(
										'!h-[40px] grow-0 border-l-0 !text-[14px]',
										'!px-[20px]'
									)}
									onClick={showAddToBoardModal}
								>
									Add to board
								</Button>
							</div>

						)}
						{/* End of Engagement */}

					</div>
				</div>
			</div>
			{!vignette ? null : (
				<div className="gradient-img c-right absolute right-0 top-0 hidden h-full w-[40%] border-l-[1px] border-solid bg-white md:block lg:block">
					<img
						className="h-full min-w-full object-contain"
						alt="Pad vignette"
						src={vignette?.replace('/sm/', '/')}
					/>
				</div>
			)}
		</section>
	);
}
