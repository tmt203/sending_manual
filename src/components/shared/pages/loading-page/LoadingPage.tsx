/**
 * Loading Page
 */
const LoadingPage = () => {
	return (
		<div className="flex-1 h-full items-center justify-center flex">
			<div className="w-40 aspect-square grid rounded-full border-[12px] border-transparent border-r-primary-500 border-t-primary-200 animate-spin">
				<div className="content-[''] col-start-1 row-start-1 m-1 rounded-full border-[12px] border-transparent border-r-secondary-500 [animation-duration:2s] border-t-secondary-200 animate-spin" />
				<div className="content-[''] col-start-1 row-start-1 m-5 rounded-full border-[12px] border-transparent border-r-success-500 [animation-duration:3s] border-t-success-200 animate-spin" />
			</div>
		</div>
	);
};

export default LoadingPage;
