import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Placement } from "@type/common.type";
import clsx from "clsx";
import { ChevronUp, Plus, Trash2 } from "lucide-react";
import { Fragment, HTMLProps } from "react";
import Button from "../molecules/Button";

export interface AccordionList {
	id: string;
	label: string;
	subAccording?: AccordionList[];
	onclick?: () => void;
}

export interface AccordionsProps extends HTMLProps<HTMLDivElement> {
	accordionList?: AccordionList[];
	anchorPlacement?: Placement;
	className?: string;
	setUuid: (id: string) => void;
	setIsAdd: (isAdd: boolean) => void;
	setIsDelete: (isDelete: boolean) => void;
}

/**
 * Accordions Component
 * @props AccordionsProps
 */
const Accordions = ({
	accordionList,
	className,
	anchorPlacement = "start",
	setUuid,
	setIsAdd,
	setIsDelete,
}: AccordionsProps) => {
	const handleAdd = (uuid: string, event: React.MouseEvent) => {
		setUuid(uuid);
		setIsAdd(true);
	};

	const handleDelete = (uuid: string, event: React.MouseEvent) => {
		setUuid(uuid);
		setIsDelete(true);
	};

	const handleChoose = (uuid: string) => {
		setUuid(uuid);
		setIsAdd(false);
	};

	return (
		<div className={clsx("w-80", className)}>
			<div className="mx-auto w-full max-w-lg divide-y divide-red/5 rounded-xl bg-red/5">
				{accordionList?.map((item, index) => (
					<Fragment key={item.id}>
						{item.subAccording?.length ? (
							<Disclosure as="div" className="p-1 border-none" defaultOpen={index === 0}>
								{({ open }) => (
									<>
										<div className="flex group">
											{/* Disclosure Button */}
											<DisclosureButton
												className={clsx("group flex items-center", {
													"justify-between": anchorPlacement === "end",
													"gap-4": anchorPlacement === "start",
												})}
											>
												{anchorPlacement === "start" && (
													<ChevronUp
														size={18}
														className={clsx(
															"transition-all text-gray-600 group-data-[hover]:text-gray-600/80 mx-1",
															{ "rotate-180": !open }
														)}
													/>
												)}
											</DisclosureButton>
											{/* Clicking Label Chooses  */}
											<span
												className="text-black font-inter text-sm font-medium leading-normal flex-grow cursor-pointer flex items-center"
												onClick={() => handleChoose(item.id)}
											>
												{item.label}
												{/* Action Buttons */}
											</span>
											<span className="ms-2 opacity-0 group-hover:opacity-100 transition-opacity flex">
												<Button
													className="min-w-8"
													icon={Plus}
													variant="primary"
													size="2xs"
													onClick={(e) => handleAdd(item.id, e)}
												/>
												<Button
													className="min-w-8"
													icon={Trash2}
													variant="danger"
													size="2xs"
													onClick={(e) => handleDelete(item.id, e)}
												>
													{" "}
												</Button>
											</span>
										</div>

										{anchorPlacement === "end" && (
											<ChevronUp
												size={16}
												className={clsx(
													"transition-all text-gray-600 group-data-[hover]:text-gray-600/80",
													{ "rotate-180": !open }
												)}
											/>
										)}
										{/* Disclosure Panel */}
										<DisclosurePanel className="mt-2 text-md text-gray-600/50 ">
											{item.subAccording?.length && item.subAccording.length > 1 ? (
												<div className="m-0 p-0 pl-8">
													<Accordions
														key={`${item.label.replace(" ", "-").toLowerCase()}-${index}`}
														accordionList={item.subAccording}
														anchorPlacement={anchorPlacement}
														setUuid={setUuid}
														setIsAdd={setIsAdd}
														setIsDelete={setIsDelete}
													/>
												</div>
											) : (
												<div
													className={clsx(
														"p-1 text-black font-inter text-sm font-medium leading-normal flex-grow cursor-pointer flex items-center",
														{
															"pl-12": anchorPlacement === "start",
															"pr-10": anchorPlacement === "end",
														}
													)}
												>
													{/* Button */}
													<button className="flex-grow text-left" onClick={item.onclick}>
														<span
															onClick={() =>
																handleChoose(item.subAccording ? item.subAccording?.[0]?.id : "")
															}
														>
															{item.subAccording?.[0]?.label ?? "No Label"}
														</span>
													</button>

													{/* Action Buttons */}
													<span className="ms-2 opacity-0 group-hover:opacity-100 transition-opacity flex">
														<Button
															className="min-w-8"
															icon={Plus}
															variant="primary"
															size="2xs"
															onClick={(e) =>
																handleAdd(item.subAccording ? item.subAccording?.[0]?.id : "", e)
															}
														/>
														<Button
															className="min-w-8"
															icon={Trash2}
															variant="danger"
															size="2xs"
															onClick={(e) =>
																handleDelete(item.subAccording ? item.subAccording?.[0]?.id : "", e)
															}
														/>
													</span>
												</div>
											)}
										</DisclosurePanel>
									</>
								)}
							</Disclosure>
						) : (
							<div
								key={`${item.label.replace(" ", "-").toLowerCase()}-${index}`}
								className={clsx(
									"p-1 text-black font-inter text-sm font-medium leading-normal flex-grow cursor-pointer group flex items-center  border-none",
									{
										"pl-8": anchorPlacement === "start",
										"pr-10": anchorPlacement === "end",
									}
								)}
							>
								{/* Clickable Button */}
								<button className="flex-grow text-left" onClick={() => handleChoose(item.id)}>
									{item.label}
								</button>
								{/* Action Buttons (Moved outside the <button>) */}
								<span className="ms-2 opacity-0 group-hover:opacity-100 transition-opacity flex">
									<Button
										className="min-w-8"
										icon={Plus}
										variant="primary"
										size="2xs"
										onClick={(e) => handleAdd(item.id, e)}
									/>
									<Button
										className="min-w-8"
										icon={Trash2}
										variant="danger"
										size="2xs"
										onClick={(e) => handleDelete(item.id, e)}
									/>
								</span>
							</div>
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default Accordions;
