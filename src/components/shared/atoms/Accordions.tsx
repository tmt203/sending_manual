import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Placement } from "@type/common.type";
import clsx from "clsx";
import { ChevronUp } from "lucide-react";
import { ComponentClass, createElement, Fragment, FunctionComponent, HTMLProps } from "react";

export interface AccordionActions {
	component: string | FunctionComponent<any> | ComponentClass<any>;
	props: any;
}
export interface AccordionList {
	label: string;
	subAccording?: AccordionList[];
	selected?: boolean;
	onclick?: () => void;
	actions?: AccordionActions[];
}

export interface AccordionsProps extends HTMLProps<HTMLDivElement> {
	accordionList?: AccordionList[];
	anchorPlacement?: Placement;
	className?: string;
}

/**
 * Accordions Component
 * @props AccordionsProps
 */
const Accordions = ({ accordionList, className, anchorPlacement = "start" }: AccordionsProps) => {
	return (
		<div className={clsx("w-full", className)}>
			<div className="flex w-full max-w-lg flex-col">
				{accordionList?.map((item, index) => (
					<Fragment key={`${item.label.replace(" ", "-").toLowerCase()}-${index}`}>
						{/* Area: Accordions List */}
						{item.subAccording?.length ? (
							<Disclosure as="div" className="w-full p-2" defaultOpen={index === 0}>
								{({ open }) => (
									<>
										{/* Area: Disclosure Button */}
										<DisclosureButton
											as="div"
											className={clsx("group flex items-center", {
												"justify-between": anchorPlacement === "end",
												"gap-4": anchorPlacement === "start",
											})}
										>
											{/* Area: Icon Start */}
											{anchorPlacement === "start" && (
												<ChevronUp
													size={16}
													className={clsx(
														"transition-all duration-300 group-data-[hover]:brightness-110",
														{
															"rotate-180": !open,
														}
													)}
												/>
											)}

											{/* Area: Label Disclosure Button */}
											<div
												className={clsx(
													"group grid w-full grid-cols-[1fr_auto] items-center rounded p-2",
													{
														"text-primary-500": item.selected,
													}
												)}
											>
												<span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold group-data-[hover]:brightness-110">
													{item.label}
												</span>
												{item.actions && (
													<div className="flex gap-2 opacity-0 transition-all duration-300 group-data-[hover]:!opacity-100">
														{item.actions.map((action, index) => {
															const actionProps = action.props;
															return createElement(action.component, {
																...(typeof actionProps === "object" ? actionProps : {}),
																key: `accordion-action-${index + 1}`,
															});
														})}
													</div>
												)}
											</div>

											{/* Area: Icon End */}
											{anchorPlacement === "end" && !item.actions && (
												<ChevronUp
													size={16}
													className={clsx(
														"transition-all duration-300 group-data-[hover]:brightness-110",
														{
															"rotate-180": !open,
														}
													)}
												/>
											)}
										</DisclosureButton>

										{/* Area: Disclosure Panel */}
										<DisclosurePanel className="mt-2">
											{item.subAccording?.length && item.subAccording.length > 1 ? (
												// Area: Sub Accordions
												<Accordions
													key={`${item.label.replace(" ", "-").toLowerCase()}-${index}`}
													accordionList={item.subAccording}
													anchorPlacement={anchorPlacement}
												/>
											) : (
												<div
													className={clsx(
														"group grid w-full grid-cols-[1fr_auto] items-center rounded p-2",
														{
															"is-link-group bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary-500/[0.12] to-primary-500/[0.04] dark:from-primary-500/[0.24]":
																item.selected,
														}
													)}
												>
													{/*	Area: Accordions Item */}
													<button
														key={`${item.label.replace(" ", "-").toLowerCase()}-${index}`}
														className={clsx(
															"min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left",
															{
																"pl-10": anchorPlacement === "start",
																"pr-10": anchorPlacement === "end",
																"text-primary-500": item.selected,
															}
														)}
														onClick={item.onclick}
													>
														{item.label}
													</button>
													{/* Area: Actions */}1
													{item.actions && (
														<div className="flex gap-2 opacity-0 transition-all duration-300 group-hover:!opacity-100">
															{item.actions.map((action, index) => {
																const actionProps = action.props;
																return createElement(action.component, {
																	...(typeof actionProps === "object" ? actionProps : {}),
																	key: `accordion-action-${index + 1}`,
																});
															})}
														</div>
													)}
												</div>
											)}
										</DisclosurePanel>
									</>
								)}
							</Disclosure>
						) : (
							<div
								className={clsx(
									"group grid w-full grid-cols-[1fr_auto] items-center rounded p-2", // dùng grid để chia phần text + actions
									{
										"is-link-group bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary-500/[0.12] to-primary-500/[0.04] dark:from-primary-500/[0.24]":
											item.selected,
									}
								)}
							>
								{/*	Area: Accordions Item */}
								<button
									key={`${item.label.replace(" ", "-").toLowerCase()}-${index}`}
									className={clsx(
										"min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left",
										{
											"pl-10": anchorPlacement === "start",
											"pr-10": anchorPlacement === "end",
											"text-primary-500": item.selected,
										}
									)}
									onClick={item.onclick}
								>
									{/*	Area: Accordions Item */}
									{item.label}
								</button>

								{/* Area: Actions */}
								{item.actions && (
									<div className="flex gap-2 opacity-0 transition-all duration-300 group-hover:!opacity-100">
										{item.actions.map((action, index) => {
											const actionProps = action.props;
											return createElement(action.component, {
												...(typeof actionProps === "object" ? actionProps : {}),
												key: `accordion-action-${index + 1}`,
											});
										})}
									</div>
								)}
							</div>
						)}
					</Fragment>
				))}
			</div>
		</div>
	);
};

export default Accordions;
