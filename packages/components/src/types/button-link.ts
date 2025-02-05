import { Generic } from '@a11y-ui/core';
import { Events } from '../enums/events';
import { watchValidator } from '../utils/prop.validators';
import { EventCallback, EventValueOrEventCallback } from './callbacks';
import { Stringified } from './common';
import { KoliBriCustomIcon, KoliBriIconProp } from './icon';
import { Alignment } from './props/alignment';

/**
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current#values
 */
export type AriaCurrent = boolean | 'page' | 'step' | 'location' | 'date' | 'time';
export type AlternativButtonLinkRole = 'button' | 'link' | 'tab';

/**
 * https://twitter.com/housecor/status/1541037184622403584?t=HoUiOAZEcXFeuDl-VWAEZg
 * https://mui.com/material-ui/react-link/#accessibility
 * https://mui.com/material-ui/react-button/#text-button
 */
type RequiredButtonAndLinkProps = {
	label: string;
};
type OptionalButtonAndLinkProps = {
	ariaControls: string;
	ariaCurrent: AriaCurrent;
	ariaExpanded: boolean;
	ariaLabel: string;
	ariaSelected: boolean;
	disabled: boolean; // TODO: Link disabled?!
	icon: Stringified<KoliBriIconProp>;
	/**
	 * @deprecated
	 */
	iconAlign: Alignment;
	iconOnly: boolean;
	role: AlternativButtonLinkRole;
	tabIndex: number;
	tooltipAlign: Alignment;
};

type RequiredButtonAndLinkStates = {
	icon: {
		top?: KoliBriCustomIcon;
		right?: KoliBriCustomIcon;
		bottom?: KoliBriCustomIcon;
		left?: KoliBriCustomIcon;
	};
	label: string;
};
type OptionalButtonAndLinkStates = {
	ariaLabel: string;
	ariaControls: string;
	ariaCurrent: AriaCurrent;
	ariaExpanded: boolean;
	ariaSelected: boolean;
	disabled: boolean;
	/**
	 * @deprecated
	 */
	iconAlign: Alignment;
	iconOnly: boolean;
	role: AlternativButtonLinkRole;
	tabIndex: number;
	tooltipAlign: Alignment;
};

/**
 * Button
 */
export type KoliBriButtonType = 'button' | 'reset' | 'submit';
export type KoliBriButtonVariant = 'primary' | 'secondary' | 'normal' | 'danger' | 'ghost' | 'custom';

export type KoliBriButtonCallbacks<T> = {
	[Events.onClick]?: EventValueOrEventCallback<MouseEvent, T>;
	[Events.onMouseDown]?: EventCallback<MouseEvent>;
};

export type KoliBriButtonVariantPropState = {
	variant: KoliBriButtonVariant;
};
export type KoliBriButtonCustomClassPropState = {
	customClass: string;
};

/**
 * API ButtonLink
 */
export type RequiredButtonLinkProps = RequiredButtonAndLinkProps;
export type OptionalButtonLinkProps = OptionalButtonAndLinkProps & {
	/**
	 * @deprecated Zweck?!
	 */
	accessKey: string;
	id: string;
	on: KoliBriButtonCallbacks<unknown>;
	type: KoliBriButtonType;
	value: Stringified<unknown>;
};
// type ButtonLinkProps = Generic.Element.Members<RequiredButtonProps, OptionalButtonProps>;

type RequiredButtonLinkStates = RequiredButtonAndLinkStates &
	KoliBriButtonVariantPropState & {
		type: KoliBriButtonType;
	};
type OptionalButtonLinkStates = OptionalButtonAndLinkStates &
	KoliBriButtonCustomClassPropState & {
		/**
		 * @deprecated Zweck?!
		 */
		accessKey: string;
		id: string;
		on: KoliBriButtonCallbacks<unknown>;
		value: unknown;
	};
// type ButtonLinkStates = Generic.Element.Members<RequiredButtonStates, OptionalButtonStates>;

/**
 * API Button
 */
export type RequiredButtonProps = RequiredButtonLinkProps;
export type OptionalButtonProps = OptionalButtonLinkProps & KoliBriButtonVariantPropState & KoliBriButtonCustomClassPropState;
export type ButtonProps = Generic.Element.Members<RequiredButtonProps, OptionalButtonProps>;

export type RequiredButtonStates = RequiredButtonLinkStates & KoliBriButtonVariantPropState;
export type OptionalButtonStates = OptionalButtonLinkStates & KoliBriButtonCustomClassPropState;
export type ButtonStates = Generic.Element.Members<RequiredButtonStates, OptionalButtonStates>;

/* LINK */

export type LinkOnCallbacks = {
	[Events.onClick]?: EventValueOrEventCallback<Event, string>;
};

// https://www.w3schools.com/tags/att_a_target.asp
export type LinkTarget = '_blank' | '_parent' | '_self' | '_top' | string;

export type LinkUseCase = 'text' | 'image' | 'nav';

/**
 * API Link
 */
export type RequiredLinkProps = RequiredButtonAndLinkProps & {
	href: string;
};
export type OptionalLinkProps = OptionalButtonAndLinkProps & {
	on: LinkOnCallbacks;
	/**
	 * @deprecated Das Styling sollte stets über CSS erfolgen.
	 */
	selector: string;
	/**
	 * @deprecated Das Styling sollte stets über CSS erfolgen.
	 */
	stealth: boolean;
	target: LinkTarget;
	targetDescription: string;
	/**
	 * @deprecated Das Styling sollte stets über CSS erfolgen.
	 */
	useCase: LinkUseCase;
};
export type LinkProps = Generic.Element.Members<RequiredLinkProps, OptionalLinkProps>;

export type RequiredLinkStates = RequiredButtonAndLinkStates & {
	href: string;
};
export type OptionalLinkStates = OptionalButtonAndLinkStates & {
	ariaSelected: boolean;
	on: LinkOnCallbacks;
	/**
	 * @deprecated Das Styling sollte stets über CSS erfolgen.
	 */
	selector: string;
	/**
	 * @deprecated Das Styling sollte stets über CSS erfolgen.
	 */
	stealth: boolean;
	target: LinkTarget;
	targetDescription: string;
	/**
	 * @deprecated Das Styling sollte stets über CSS erfolgen.
	 */
	useCase: LinkUseCase;
};
export type LinkStates = Generic.Element.Members<RequiredLinkStates, OptionalLinkStates>;

/**
 * API LinkButton
 */
export type RequiredLinkButtonProps = RequiredLinkProps;
export type OptionalLinkButtonProps = OptionalLinkProps & KoliBriButtonVariantPropState & KoliBriButtonCustomClassPropState;
// type LinkButtonProps = Generic.Element.Members<RequiredLinkButtonProps, OptionalLinkButtonProps>;

export type RequiredLinkButtonStates = KoliBriButtonVariantPropState;
export type OptionalLinkButtonStates = KoliBriButtonCustomClassPropState;
export type LinkButtonStates = Generic.Element.Members<RequiredLinkButtonStates, OptionalLinkButtonStates>;

export const watchTooltipAlignment = (component: Generic.Element.Component, propName: string, value?: Alignment): void => {
	watchValidator(
		component,
		propName,
		(value) => value === 'top' || value === 'right' || value === 'bottom' || value === 'left',
		new Set(['Alignment {top, right, buttom, left}']),
		value,
		{
			defaultValue: 'top',
		}
	);
};
