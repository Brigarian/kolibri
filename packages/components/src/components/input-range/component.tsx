import { Component, Element, h, Host, JSX, Prop, State, Watch } from '@stencil/core';
import { Stringified } from '../../types/common';

import { InputTypeOnDefault, InputTypeOnOff, Option } from '../../types/input/types';
import { propergateFocus } from '../../utils/reuse';
import { KoliBriHorizontalIcon } from '../../types/icon';
import { getRenderStates } from '../input/controller';
import { InputRangeController } from './controller';
import { ComponentApi, States } from './types';

@Component({
	tag: 'kol-input-range',
	styleUrls: {
		default: './style.css',
	},
	shadow: true,
})
export class KolInputRange implements ComponentApi {
	@Element() private readonly host?: HTMLKolInputRangeElement;
	private ref?: HTMLInputElement;

	private readonly catchRef = (ref?: HTMLInputElement) => {
		this.ref = ref;
		propergateFocus(this.host, this.ref);
	};

	public render(): JSX.Element {
		const { ariaDiscribedBy } = getRenderStates(this.state);
		const hasList = Array.isArray(this.state._list) && this.state._list.length > 0;
		return (
			<Host>
				<kol-input
					_disabled={this.state._disabled}
					_error={this.state._error}
					_hideLabel={this.state._hideLabel}
					_hint={this.state._hint}
					_icon={this.state._icon}
					_id={this.state._id}
					_touched={this.state._touched}
				>
					<span slot="label">
						<slot />
					</span>
					<input
						ref={this.catchRef}
						part="input"
						title=""
						accessKey={this.state._accessKey}
						aria-describedby={ariaDiscribedBy.length > 0 ? ariaDiscribedBy.join(' ') : undefined}
						aria-labelledby={`${this.state._id}-label`}
						autoCapitalize="off"
						autoComplete={this.state._autoComplete}
						autoCorrect="off"
						disabled={this.state._disabled}
						id={this.state._id}
						list={hasList ? `${this.state._id}-list` : undefined}
						max={this.state._max}
						min={this.state._min}
						name={this.state._name}
						slot="input"
						spellcheck="false"
						step={this.state._step}
						type="range"
						value={this.state._value as number}
						{...this.controller.onFacade}
					/>
					{hasList && [
						<datalist id={`${this.state._id}-list`}>
							{this.state._list.map((option: Option<number>) => (
								<option value={option.value}></option>
							))}
						</datalist>,
						// <ul class="grid gap-1 text-sm grid-flow-col">
						//   {this.state._list.map((option: InputOption<number>) => (
						//     <li class="border-1">{option.label}</li>
						//   ))}
						// </ul>,
					]}
				</kol-input>
			</Host>
		);
	}

	private readonly controller: InputRangeController;

	/**
	 * Gibt an, mit welcher Tastenkombination man das Input auslösen oder fokussieren kann.
	 */
	@Prop() public _accessKey?: string;

	/**
	 * Gibt an, ob die Fehlermeldung vorgelesen werden soll, wenn es eine gibt.
	 */
	@Prop({ mutable: true, reflect: true }) public _alert?: boolean = true;

	/**
	 * Gibt an, ob das Eingabefeld autovervollständigt werden kann.
	 */
	@Prop() public _autoComplete?: InputTypeOnOff;

	/**
	 * Gibt an, ob das Eingabefeld aktiviert oder deaktiviert ist.
	 */
	@Prop({ reflect: true }) public _disabled?: boolean;

	/**
	 * Gibt den Text für eine Fehlermeldung an.
	 */
	@Prop() public _error?: string;

	/**
	 * Gibt an, ob das Eingabefeld kein sichtbares Label haben soll.
	 */
	@Prop({ reflect: true }) public _hideLabel?: boolean;

	/**
	 * Gibt den Text für eine Hinweistext an.
	 */
	@Prop() public _hint?: string = '';

	/**
	 * Ermöglicht das Anzeigen von Icons links und/oder rechts am Rand des Eingabefeldes.
	 */
	@Prop() public _icon?: Stringified<KoliBriHorizontalIcon>;

	/**
	 * Gibt die technische ID des Eingabefeldes an.
	 */
	@Prop() public _id!: string;

	/**
	 * Gibt die Liste der Vorschlagswörter an.
	 */
	@Prop() public _list?: Stringified<Option<number>[]>;

	/**
	 * Gibt den Maximalwert des Eingabefeldes an.
	 */
	@Prop() public _max?: number;

	/**
	 * Gibt den Minimalwert des Eingabefeldes an.
	 */
	@Prop() public _min?: number;

	/**
	 * Gibt den technischen Namen des Eingabefeldes an.
	 */
	@Prop() public _name?: string;

	/**
	 * Gibt die EventCallback-Funktionen für das Input-Event an.
	 */
	@Prop() public _on?: InputTypeOnDefault;

	/**
	 * Gibt die Schrittweite der Wertveränderung an.
	 */
	@Prop() public _step?: number;

	/**
	 * Gibt an, welchen Tab-Index dieses Input hat.
	 */
	@Prop() public _tabIndex?: number;

	/**
	 * Gibt an, ob dieses Eingabefeld von Nutzer:innen einmal besucht/berührt wurde.
	 */
	@Prop({ mutable: true, reflect: true }) public _touched?: boolean = false;

	/**
	 * Gibt den Wert des Eingabefeldes an.
	 */
	@Prop() public _value?: number;

	/**
	 * @see: components/abbr/component.tsx (@State)
	 */
	@State() public state: States = {
		_autoComplete: 'off',
		_id: '…', // ⚠ required
		_list: [],
	};

	public constructor() {
		this.controller = new InputRangeController(this, 'range', this.host);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_accessKey')
	public validateAccessKey(value?: string): void {
		this.controller.validateAccessKey(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_alert')
	public validateAlert(value?: boolean): void {
		this.controller.validateAlert(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_autoComplete')
	public validateAutoComplete(value?: InputTypeOnOff): void {
		this.controller.validateAutoComplete(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_disabled')
	public validateDisabled(value?: boolean): void {
		this.controller.validateDisabled(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_error')
	public validateError(value?: string): void {
		this.controller.validateError(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_hideLabel')
	public validateHideLabel(value?: boolean): void {
		this.controller.validateHideLabel(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_hint')
	public validateHint(value?: string): void {
		this.controller.validateHint(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_icon')
	public validateIcon(value?: Stringified<KoliBriHorizontalIcon>): void {
		this.controller.validateIcon(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_id')
	public validateId(value?: string): void {
		this.controller.validateId(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_list')
	public validateList(value?: Stringified<Option<number>[]>): void {
		this.controller.validateList(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_max')
	public validateMax(value?: number): void {
		this.controller.validateMax(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_min')
	public validateMin(value?: number): void {
		this.controller.validateMin(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_name')
	public validateName(value?: string): void {
		this.controller.validateName(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_on')
	public validateOn(value?: InputTypeOnDefault): void {
		this.controller.validateOn(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_step')
	public validateStep(value?: number): void {
		this.controller.validateStep(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_tabIndex')
	public validateTabIndex(value?: number): void {
		this.controller.validateTabIndex(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_touched')
	public validateTouched(value?: boolean): void {
		this.controller.validateTouched(value);
	}

	/**
	 * @see: components/abbr/component.tsx (@Watch)
	 */
	@Watch('_value')
	public validateValue(value?: number): void {
		this.controller.validateValue(value);
	}

	/**
	 * @see: components/abbr/component.tsx (componentWillLoad)
	 */
	public componentWillLoad(): void {
		this._alert = this._alert === true;
		this._touched = this._touched === true;
		this.controller.componentWillLoad();
	}
}
