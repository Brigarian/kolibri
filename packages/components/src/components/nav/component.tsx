import { Component, h, Host, JSX, Prop, State, Watch } from '@stencil/core';
import { Generic } from '@a11y-ui/core';
import { Orientation } from '../../types/orientation';
import { a11yHintLabelingLandmarks, devHint } from '../../utils/a11y.tipps';
import { watchBoolean, watchString, watchValidator } from '../../utils/prop.validators';
import { NavLinkProps } from '../link/component';
import { watchNavLinks } from './validation';
import { Stringified } from '../../types/common';
import { AriaCurrent, KoliBriButtonCallbacks } from '../../types/button-link';
import { translate } from '../../i18n';
import { KoliBriIconProp } from '../../components';

export type NavLinkWithChildrenProps = NavLinkProps & {
	_children?: NavLinkWithChildrenProps[];
};

export type KoliBriNavVariant = 'primary' | 'secondary';

const UNIQUE_ARIA_LABEL: string[] = [];
const removeAriaLabel = (ariaLabel: string) => {
	const index = UNIQUE_ARIA_LABEL.indexOf(ariaLabel);
	if (index >= 0) {
		UNIQUE_ARIA_LABEL.splice(index, 1);
	}
};

const linkValidator = (link: NavLinkWithChildrenProps): boolean => {
	if (typeof link === 'object' && typeof link._label === 'string' /* && typeof newLink._href === 'string' */) {
		if (Array.isArray(link._children)) {
			return linksValidator(link._children);
		}
		return false;
	}
	return true;
};

const linksValidator = (links: NavLinkWithChildrenProps[]): boolean => {
	if (Array.isArray(links)) {
		return links.find(linkValidator) !== undefined;
	}
	return true;
};

/**
 * API
 */
type RequiredProps = {
	ariaLabel: string;
	links: Stringified<NavLinkWithChildrenProps[]>;
};
type OptionalProps = {
	ariaCurrentValue: AriaCurrent;
	collapsible: boolean;
	compact: boolean;
	hasCompactButton: boolean;
	orientation: Orientation;
	variant: KoliBriNavVariant;
};
// type Props = Generic.Element.Members<RequiredProps, OptionalProps>;

type RequiredStates = {
	ariaCurrentValue: AriaCurrent;
	ariaLabel: string;
	collapsible: boolean;
	hasCompactButton: boolean;
	links: NavLinkWithChildrenProps[];
	orientation: Orientation;
	variant: KoliBriNavVariant;
};
type OptionalStates = {
	compact: boolean;
};
type States = Generic.Element.Members<RequiredStates, OptionalStates>;

/**
 * @part nav - TBD
 */
@Component({
	tag: 'kol-nav',
	styleUrls: {
		default: './style.css',
	},
	shadow: true,
})
export class KolNav implements Generic.Element.ComponentApi<RequiredProps, OptionalProps, RequiredStates, OptionalStates> {
	private readonly onClick = (link: NavLinkWithChildrenProps): void => {
		link._active = !link._active;
		this.state = {
			...this.state,
		};
	};

	private readonly hasActiveChild = (link: NavLinkWithChildrenProps): boolean => {
		if (Array.isArray(link._children) && link._children.length > 0) {
			return link._children.some(this.hasActiveChild);
		}

		return false;
	};

	/** Element creation functions */
	private button(
		selected: boolean,
		compact: boolean,
		disabled: boolean,
		icon: Stringified<KoliBriIconProp> | undefined,
		iconOnly: boolean,
		label: string,
		on: KoliBriButtonCallbacks<unknown>
	): JSX.Element {
		return (
			<kol-button-wc
				exportparts={`icon,button,span${selected ? ',selected' : ''}`}
				// _ariaCurrent will not be set here, since it will be set on a child of this item.
				_ariaLabel={compact || iconOnly ? label : undefined}
				_ariaExpanded={selected}
				_disabled={disabled}
				_icon={icon}
				_iconOnly={compact || iconOnly}
				_label={label}
				_on={on}
			></kol-button-wc>
		);
	}

	private dropDown(collapsible: boolean, compact: boolean, deep: number, link: NavLinkWithChildrenProps, orientation: Orientation): JSX.Element {
		return (
			<div
				class={{
					'list-container': true,
					'active-child': this.hasActiveChild(link),
					'absolute ': deep === 0 && orientation === 'horizontal',
				}}
			>
				{/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
				<this.linkList collapsible={collapsible} compact={compact} deep={deep + 1} links={link._children!} orientation={orientation} />
			</div>
		);
	}

	private entry(
		collapsible: boolean,
		compact: boolean,
		hasChildren: boolean,
		link: NavLinkWithChildrenProps,
		expanded: boolean,
		selected: boolean,
		textCenter: boolean
	): JSX.Element {
		return (
			<div
				class={{
					entry: true,
					'has-children': hasChildren,
					'has-link': !!link._href,
					selected,
					expanded,
					'text-center': textCenter,
				}}
			>
				{this.textLinkOrButton(collapsible, compact, link, selected)}
				{hasChildren ? this.expandButton(collapsible, link, selected) : ''}
			</div>
		);
	}

	private expandButton(collapsible: boolean, link: NavLinkWithChildrenProps, selected: boolean): JSX.Element {
		return (
			<kol-button-wc
				_customClass="expand-button"
				_disabled={!collapsible || !link._href}
				_icon={'codicon codicon-' + (selected ? 'remove' : 'add')}
				_label=""
				_variant="custom"
				class="expand-button-container"
				onClick={() => this.onClick(link)}
			></kol-button-wc>
		);
	}

	private li(
		collapsible: boolean,
		compact: boolean,
		deep: number,
		index: number,
		isLast: boolean,
		link: NavLinkWithChildrenProps,
		orientation: Orientation
	): JSX.Element {
		const hasChildren = Array.isArray(link._children) && link._children.length > 0;
		const selected = !!link._active;
		const expanded = hasChildren && !!link._active;
		const textCenter = compact || link._iconOnly === true;
		return (
			<li
				class={{ selected, 'has-children': hasChildren }}
				key={index}
				part={`li ${deep === 0 ? orientation : 'vertical'}${selected ? ' selected' : ''}${isLast ? '' : ' last'}`}
				style={{ position: 'relative' }}
			>
				{this.entry(collapsible, compact, hasChildren, link, expanded, selected, textCenter)}
				{hasChildren && selected ? this.dropDown(collapsible, compact, deep, link, orientation) : ''}
			</li>
		);
	}

	private link(
		selected: boolean,
		compact: boolean,
		disabled: boolean,
		href: string,
		icon: Stringified<KoliBriIconProp> | undefined,
		iconOnly: boolean,
		label: string
	): JSX.Element {
		return (
			<kol-link-wc
				exportparts={`icon,link,span${selected ? ',selected' : ''}`}
				// _ariaCurrent will not be set here, since it will be set on a child of this item.
				_ariaLabel={compact || iconOnly ? label : undefined}
				_ariaExpanded={selected}
				_disabled={disabled}
				_href={href}
				_icon={icon}
				_iconOnly={compact || iconOnly}
				_label={label}
			></kol-link-wc>
		);
	}

	private linkList = (props: {
		collapsible: boolean;
		compact: boolean;
		deep: number;
		links: NavLinkWithChildrenProps[];
		orientation: Orientation;
	}): JSX.Element => {
		return (
			<ul
				class={`list ${props.deep === 0 && props.orientation === 'horizontal' ? ' horizontal' : ' vertical'}`}
				data-deep={props.deep}
				part={`nav ${props.orientation}`}
			>
				{props.links.map((link, index: number) => {
					return this.li(props.collapsible, props.compact, props.deep, index, index < props.links.length - 1, link, props.orientation);
				})}
			</ul>
		);
	};

	private textLinkOrButton(collapsible: boolean, compact: boolean, link: NavLinkWithChildrenProps, selected: boolean): JSX.Element {
		if (link._href) {
			return this.link(selected, compact, link._disabled === true, link._href, link._icon, link._iconOnly === true, link._label);
		} else {
			return this.button(
				selected,
				compact,
				link._disabled === true,
				link._icon,
				link._iconOnly === true,
				link._label,
				(link._on ? link._on : collapsible ? { onClick: () => this.onClick(link) } : null) as KoliBriButtonCallbacks<unknown>
			);
		}
	}

	public render(): JSX.Element {
		let hasCompactButton = this.state._hasCompactButton;
		if (this.state._orientation === 'horizontal' && this.state._hasCompactButton === true) {
			hasCompactButton = false;
			devHint(`[KolNav] Wenn eine horizontale Navigation verwendet wird, kann die Option _hasCompactButton nicht aktiviert werden.`);
		}
		const collapsible = this.state._collapsible;
		const compact = this.state._compact === true;
		const orientation = this.state._orientation;
		return (
			<Host>
				<div
					class={{
						[orientation]: true,
						'inline-block': compact,
						[this.state._variant]: true,
					}}
				>
					<nav aria-label={this.state._ariaLabel} id="nav" part="nav">
						<this.linkList collapsible={collapsible} compact={compact} deep={0} links={this.state._links} orientation={orientation}></this.linkList>
					</nav>
					{hasCompactButton && (
						<div class="mt-2 w-full text-center">
							<kol-button
								exportparts="button,ghost"
								_ariaControls="nav"
								_ariaExpanded={compact}
								_ariaLabel={translate(compact ? 'kol-nav-maximize' : 'kol-nav-minimize')}
								_icon={compact ? 'codicon codicon-chevron-right' : 'codicon codicon-chevron-left'}
								_iconOnly
								_label={translate(compact ? 'kol-nav-maximize' : 'kol-nav-minimize')}
								_on={{
									onClick: (): void => {
										this.state = {
											...this.state,
											_compact: this.state._compact === false,
										};
									},
								}}
								_tooltipAlign="right"
								_variant="ghost"
							></kol-button>
						</div>
					)}
				</div>
			</Host>
		);
	}

	/**
	 * Gibt den Wert von aria-current an, der bei dem aktuellen Kontext innerhalb der Navigation verwendet werden soll.
	 */
	@Prop() public _ariaCurrentValue: AriaCurrent = false;

	/**
	 * Gibt den Text an, der die Navigation von anderen Navigationen differenziert.
	 */
	@Prop() public _ariaLabel!: string;

	/**
	 * Gibt an, ob Knoten in der Navigation zusammengeklappt werden können. Ist standardmäßig aktiv.
	 */
	@Prop({ reflect: true }) public _collapsible?: boolean = true;

	/**
	 * Gibt an, ob die Navigation kompakt angezeigt wird.
	 */
	@Prop({ reflect: true }) public _compact?: boolean = false;

	/**
	 * Gibt an, ob die Navigation eine zusätzliche Schaltfläche zum Aus- und Einklappen der Navigation anzeigen soll.
	 */
	@Prop({ reflect: true }) public _hasCompactButton?: boolean = false;

	/**
	 * Gibt die Ausrichtung der Navigation an.
	 */
	@Prop() public _orientation?: Orientation = 'vertical';

	/**
	 * Gibt die geordnete Liste der Seitenhierarchie an.
	 */
	@Prop() public _links!: Stringified<NavLinkWithChildrenProps[]>;

	/**
	 * Gibt an, welche Ausprägung der Button hat.
	 */
	@Prop() public _variant?: KoliBriNavVariant = 'primary';

	/**
	 * @see: components/abbr/component.tsx (@State)
	 */
	@State() public state: States = {
		_ariaCurrentValue: false,
		_ariaLabel: '…', // '⚠'
		_collapsible: true,
		_hasCompactButton: false,
		_links: [],
		_orientation: 'vertical',
		_variant: 'primary',
	};

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_ariaCurrentValue')
	public validateAriaCurrentValue(value?: AriaCurrent): void {
		watchValidator(
			this,
			'_ariaCurrentValue',
			(value) => value === true || value === 'date' || value === 'location' || value === 'page' || value === 'step' || value === 'time',
			new Set(['boolean', 'String {data, location, page, step, time}']),
			value
		);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_ariaLabel')
	public validateAriaLabel(value?: string): void {
		watchString(this, '_ariaLabel', value, {
			hooks: {
				afterPatch: () => {
					if (UNIQUE_ARIA_LABEL.includes(this.state._ariaLabel)) {
						devHint(`[KolNav] Das Aria-Label "${this.state._ariaLabel}" wurde für die Rolle Navigation mehrfach verwendet!`);
					}
					UNIQUE_ARIA_LABEL.push(this.state._ariaLabel);
				},
				beforePatch: () => {
					removeAriaLabel(this.state._ariaLabel);
				},
			},
			required: true,
		});
		a11yHintLabelingLandmarks(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_collapsible')
	public validateCollapsible(value?: boolean): void {
		watchBoolean(this, '_collapsible', value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_compact')
	public validateCompact(value?: boolean): void {
		watchBoolean(this, '_compact', value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_hasCompactButton')
	public validateHasCompactButton(value?: boolean): void {
		watchBoolean(this, '_hasCompactButton', value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_links')
	public validateLinks(value?: Stringified<NavLinkWithChildrenProps[]>): void {
		watchNavLinks('KolNav', this, value);
		devHint(`[KolNav] Die Navigationsstruktur wird noch nicht rekursiv validiert.`);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_orientation')
	public validateOrientation(value?: Orientation): void {
		watchValidator(
			this,
			'_orientation',
			(value): boolean => value === 'horizontal' || value === 'vertical',
			new Set(['Orientation {horizontal, vertical}']),
			value,
			{
				defaultValue: 'vertical',
			}
		);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_variant')
	public validateVariant(value?: KoliBriNavVariant): void {
		watchValidator(this, '_variant', (value) => value === 'primary' || value === 'secondary', new Set(['KoliBriNavVariant {primary, secondary}']), value, {
			defaultValue: 'primary',
		});
	}

	/**
	 * @see: components/abbr/component.tsx (componentWillLoad)
	 */
	public componentWillLoad(): void {
		this.validateAriaCurrentValue(this._ariaCurrentValue);
		this.validateAriaLabel(this._ariaLabel);
		this.validateCollapsible(this._collapsible);
		this.validateCompact(this._compact);
		this.validateHasCompactButton(this._hasCompactButton);
		this.validateLinks(this._links);
		this.validateOrientation(this._orientation);
		this.validateVariant(this._variant);
	}

	public disconnectedCallback(): void {
		removeAriaLabel(this.state._ariaLabel);
	}
}
