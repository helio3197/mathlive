/* 0.94.5 */import type { Selector } from './commands';
import type { LatexSyntaxError, MacroDictionary, ParseMode, Registers, Style } from './core-types';
import type { InsertOptions, OutputFormat, Offset, Range, Selection, Mathfield } from './mathfield';
import type { InlineShortcutDefinitions, Keybinding, MathfieldOptions } from './options';
import type { ComputeEngine } from '@cortex-js/compute-engine';
export declare type Expression = number | string | {
    [key: string]: any;
} | [Expression, ...Expression[]];
/**
 * The `focus-out` event signals that the mathfield has lost focus through keyboard
 * navigation with the **tab** key.
 *
 * The event `detail.direction` property indicates if **tab**
 * (`direction === "forward"`) or **shift+tab** (`direction === "backward") was
 * pressed which can be useful to decide which element to focus next.
 *
 * If the event is canceled by calling `ev.preventDefault()`, no change of
 * focus will occur (but you can manually change the focus in your event
 * handler: this gives you an opportunity to override the default behavior
 * and selects which element should get the focus, or to prevent from a change
 * of focus altogether).
 *
 * If the event is not canceled, the default behavior will take place, which is
 * to change the focus to the next/previous focusable element.
 *
 * ```javascript
 * mfe.addEventListener('focus-out', (ev) => {
 *  console.log("Losing focus ", ev.detail.direction);
 * });
 * ```
 */
export type FocusOutEvent = {
    direction: 'forward' | 'backward';
};
/**
 * The `move-out` event signals that the user pressed an **arrow** key but
 * there was no navigation possible inside the mathfield.
 *
 * This event provides an opportunity to handle this situation, for example
 * by focusing an element adjacent to the mathfield.
 *
 * If the event is canceled (i.e. `evt.preventDefault()` is called inside your
 * event handler), the default behavior is to play a "plonk" sound.
 *
 */
export type MoveOutEvent = {
    direction: 'forward' | 'backward' | 'upward' | 'downward';
};
/**
 * - `"auto"`: the virtual keyboard is triggered when a
 * mathfield is focused on a touch capable device.
 * - `"manual"`: the virtual keyboard is not triggered automatically
 * - `"sandboxed"`: the virtual keyboard is displayed in the current browsing
 * context (iframe) if it has a defined container or is the top-level browsing
 * context.
 *
 */
export type VirtualKeyboardPolicy = 'auto' | 'manual' | 'sandboxed';
declare global {
    /**
     * Map the custom event names to types
     * @internal
     */
    interface HTMLElementEventMap {
        'focus-out': CustomEvent<FocusOutEvent>;
        'mode-change': Event;
        'mount': Event;
        'move-out': CustomEvent<MoveOutEvent>;
        'unmount': Event;
        'read-aloud-status-change': Event;
        'selection-change': Event;
        'undo-state-change': Event;
        'before-virtual-keyboard-toggle': Event;
        'virtual-keyboard-toggle': Event;
    }
}
/**
 * These attributes of the `<math-field>` element correspond to the
 * [MathfieldOptions] properties.
 */
export interface MathfieldElementAttributes {
    [key: string]: unknown;
    'default-mode': string;
    'letter-shape-style': string;
    'min-font-scale': number;
    'popover-policy': string;
    /**
     * The LaTeX string to insert when the spacebar is pressed (on the physical or
     * virtual keyboard). Empty by default. Use `\;` for a thick space, `\:` for
     * a medium space, `\,` for a thin space.
     */
    'math-mode-space': string;
    /** When true, the user cannot edit the mathfield. */
    'read-only': boolean;
    'remove-extraneous-parentheses': boolean;
    /**
     * When `on` and an open fence is entered via `typedText()` it will
     * generate a contextually appropriate markup, for example using
     * `\left...\right` if applicable.
     *
     * When `off`, the literal value of the character will be inserted instead.
     */
    'smart-fence': string;
    /**
     * When `on`, during text input the field will switch automatically between
     * 'math' and 'text' mode depending on what is typed and the context of the
     * formula. If necessary, what was previously typed will be 'fixed' to
     * account for the new info.
     *
     * For example, when typing "if x >0":
     *
     * | Type  | Interpretation |
     * |---:|:---|
     * | "i" | math mode, imaginary unit |
     * | "if" | text mode, english word "if" |
     * | "if x" | all in text mode, maybe the next word is xylophone? |
     * | "if x >" | "if" stays in text mode, but now "x >" is in math mode |
     * | "if x > 0" | "if" in text mode, "x > 0" in math mode |
     *
     * Smart Mode is `off` by default.
     *
     * Manually switching mode (by typing `alt/option+=`) will temporarily turn
     * off smart mode.
     *
     *
     * **Examples**
     *
     * -   slope = rise/run
     * -   If x > 0, then f(x) = sin(x)
     * -   x^2 + sin (x) when x > 0
     * -   When x<0, x^{2n+1}<0
     * -   Graph x^2 -x+3 =0 for 0<=x<=5
     * -   Divide by x-3 and then add x^2-1 to both sides
     * -   Given g(x) = 4x – 3, when does g(x)=0?
     * -   Let D be the set {(x,y)|0<=x<=1 and 0<=y<=x}
     * -   \int\_{the unit square} f(x,y) dx dy
     * -   For all n in NN
     *
     */
    'smart-mode': string;
    /**
     * When `on`, when a digit is entered in an empty superscript, the cursor
     * leaps automatically out of the superscript. This makes entry of common
     * polynomials easier and faster. If entering other characters (for example
     * "n+1") the navigation out of the superscript must be done manually (by
     * using the cursor keys or the spacebar to leap to the next insertion
     * point).
     *
     * When `off`, the navigation out of the superscript must always be done
     * manually.
     *
     */
    'smart-superscript': string;
    /**
     * Maximum time, in milliseconds, between consecutive characters for them to be
     * considered part of the same shortcut sequence.
     *
     * A value of 0 is the same as infinity: any consecutive character will be
     * candidate for an inline shortcut, regardless of the interval between this
     * character and the previous one.
     *
     * A value of 750 will indicate that the maximum interval between two
     * characters to be considered part of the same inline shortcut sequence is
     * 3/4 of a second.
     *
     * This is useful to enter "+-" as a sequence of two characters, while also
     * supporting the "±" shortcut with the same sequence.
     *
     * The first result can be entered by pausing slightly between the first and
     * second character if this option is set to a value of 250 or so.
     *
     * Note that some operations, such as clicking to change the selection, or
     * losing the focus on the mathfield, will automatically timeout the
     * shortcuts.
     */
    'inline-shortcut-timeout': string;
    'script-depth': string;
    /**
     * - `"auto"`: the virtual keyboard is triggered when a
     * mathfield is focused on a touch capable device.
     * - `"manual"`: the virtual keyboard is not triggered automatically
     * - `"sandboxed"`: the virtual keyboard is displayed in the current browsing
     * context (iframe) if it has a defined container or is the top-level browsing
     * context.
     *
     */
    'math-virtual-keyboard-policy': VirtualKeyboardPolicy;
    /**
     * Specify the `targetOrigin` parameter for
     * [postMessage](https://developer.mozilla.org/en/docs/Web/API/Window/postMessage)
     * to send control messages from child to parent frame to remote control
     * of mathfield component.
     *
     * **Default**: `window.origin`
     */
    'virtual-keyboard-target-origin': string;
}
/**
 * The `MathfieldElement` class provides special properties and
 * methods to control the display and behavior of `<math-field>`
 * elements.
 *
 * It inherits many useful properties and methods from [[`HTMLElement`]] such
 * as `style`, `tabIndex`, `addEventListener()`, `getAttribute()`,  etc...
 *
 * To create a new `MathfieldElement`:
 *
 * ```javascript
 * // 1. Create a new MathfieldElement
 * const mfe = new MathfieldElement();
 * // 2. Attach it to the DOM
 * document.body.appendChild(mfe);
 * ```
 *
 * The `MathfieldElement` constructor has an optional argument of
 * [[`MathfieldOptions`]] to configure the element. The options can also
 * be modified later:
 *
 * ```javascript
 * // Setting options during construction
 * const mfe = new MathfieldElement({ smartFence: false });
 * // Modifying options after construction
 * mfe.setOptions({ smartFence: true });
 * ```
 *
 * ### CSS Variables
 *
 * To customize the appearance of the mathfield, declare the following CSS
 * variables (custom properties) in a ruleset that applies to the mathfield.
 *
 * ```css
 * math-field {
 *  --hue: 10       // Set the highlight color and caret to a reddish hue
 * }
 * ```
 *
 * Alternatively you can set these CSS variables programatically:
 *
 * ```js
 *   document.body.style.setProperty("--hue", "10");
 * ```
 * <div class='symbols-table' style='--first-col-width:25ex'>
 *
 * | CSS Variable | Usage |
 * |:---|:---|
 * | `--hue` | Hue of the highlight color and the caret |
 * | `--contains-highlight-background-color` | Backround property for items that contain the caret |
 * | `--primary-color` | Primary accent color, used for example in the virtual keyboard |
 * | `--text-font-family` | The font stack used in text mode |
 * | `--smart-fence-opacity` | Opacity of a smart fence (default is 50%) |
 * | `--smart-fence-color` | Color of a smart fence (default is current color) |
 *
 * </div>
 *
 * You can customize the appearance and zindex of the virtual keyboard panel
 * with some CSS variables associated with a selector that applies to the
 * virtual keyboard panel container.
 *
 * Read more about [customizing the virtual keyboard appearance](https://cortexjs.io/mathlive/guides/virtual-keyboards/#custom-appearance)
 *
 * ### CSS Parts
 *
 * To style the virtual keyboard toggle, use the `virtual-keyboard-toggle` CSS
 * part. To use it, define a CSS rule with a `::part()` selector
 * for example:
 * ```css
 * math-field::part(virtual-keyboard-toggle) {
 *  color: red;
 * }
 * ```
 *
 *
 * ### Attributes
 *
 * An attribute is a key-value pair set as part of the tag:
 *
 * ```html
 * <math-field letter-shape-style="tex"></math-field>
 * ```
 *
 * The supported attributes are listed in the table below with their
 * corresponding property.
 *
 * The property can also be changed directly on the `MathfieldElement` object:
 *
 * ```javascript
 *  getElementById('mf').value = "\\sin x";
 *  getElementById('mf').letterShapeStyle = "text";
 * ```
 *
 * The values of attributes and properties are reflected, which means you can
 * change one or the other, for example:
 *
 * ```javascript
 * getElementById('mf').setAttribute('letter-shape-style',  'french');
 * console.log(getElementById('mf').letterShapeStyle);
 * // Result: "french"
 * getElementById('mf').letterShapeStyle ='tex;
 * console.log(getElementById('mf').getAttribute('letter-shape-style');
 * // Result: 'tex'
 * ```
 *
 * An exception is the `value` property, which is not reflected on the `value`
 * attribute: for consistency with other DOM elements, the `value` attribute
 * remains at its initial value.
 *
 *
 * <div class='symbols-table' style='--first-col-width:32ex'>
 *
 * | Attribute | Property |
 * |:---|:---|
 * | `disabled` | `mf.disabled` |
 * | `default-mode` | `mf.defaultMode` |
 * | `letter-shape-style` | `mf.letterShapeStyle` |
 * | `min-font-scale` | `mf.minFontScale` |
 * | `popover-policy` | `mf.popoverPolicy` |
 * | `math-mode-space` | `mf.mathModeSpace` |
 * | `read-only` | `mf.readOnly` |
 * | `remove-extraneous-parentheses` | `mf.removeExtraneousParentheses` |
 * | `smart-fence` | `mf.smartFence` |
 * | `smart-mode` | `mf.smartMode` |
 * | `smart-superscript` | `mf.smartSuperscript` |
 * | `inline-shortcut-timeout` | `mf.inlineShortcutTimeout` |
 * | `script-depth` | `mf.scriptDepth` |
 * | `value` | `value` |
 * | `math-virtual-keyboard-policy` | `mathVirtualKeyboardPolicy` |
 *
 * </div>
 *
 * See [[`MathfieldOptions`]] for more details about these options.
 *
 * In addition, the following [global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)
 * can also be used:
 * - `class`
 * - `data-*`
 * - `hidden`
 * - `id`
 * - `item*`
 * - `style`
 * - `tabindex`
 *
 *
 * ### Events
 *
 * Listen to these events by using `addEventListener()`. For events with
 * additional arguments, the arguments are available in `event.detail`.
 *
 * <div class='symbols-table' style='--first-col-width:27ex'>
 *
 * | Event Name  | Description |
 * |:---|:---|
 * | `beforeinput` | The value of the mathfield is about to be modified.  |
 * | `input` | The value of the mathfield has been modified. This happens on almost every keystroke in the mathfield.  |
 * | `change` | The user has committed the value of the mathfield. This happens when the user presses **Return** or leaves the mathfield. |
 * | `selection-change` | The selection (or caret position) in the mathfield has changed |
 * | `mode-change` | The mode (`math`, `text`) of the mathfield has changed |
 * | `undo-state-change` |  The state of the undo stack has changed |
 * | `read-aloud-status-change` | The status of a read aloud operation has changed |
 * | `before-virtual-keyboard-toggle` | The visibility of the virtual keyboard panel is about to change.  |
 * | `virtual-keyboard-toggle` | The visibility of the virtual keyboard panel has changed. Listen for this event on `window.mathVirtualKeyboard` |
 * | `blur` | The mathfield is losing focus |
 * | `focus` | The mathfield is gaining focus |
 * | `focus-out` | The user is navigating out of the mathfield, typically using the **tab** key<br> `detail: {direction: 'forward' | 'backward' | 'upward' | 'downward'}` **cancellable**|
 * | `move-out` | The user has pressed an **arrow** key, but there is nowhere to go. This is an opportunity to change the focus to another element if desired. <br> `detail: {direction: 'forward' | 'backward' | 'upward' | 'downward'}` **cancellable**|
 * | `keystroke` | The user typed a keystroke with a physical keyboard <br> `detail: {keystroke: string, event: KeyboardEvent}` |
 * | `mount` | The element has been attached to the DOM |
 * | `unmount` | The element is about to be removed from the DOM |
 *
 * </div>
 *
 * @keywords zindex, events, attribute, attributes, property, properties, parts, variables, css, mathfield, mathfieldelement

 */
export declare class MathfieldElement extends HTMLElement implements Mathfield {
    static version: string;
    static get formAssociated(): boolean;
    /**
     * Private lifecycle hooks.
     * If adding a 'boolean' attribute, add its default value to getOptionsFromAttributes
     * @internal
     */
    static get optionsAttributes(): Record<string, 'number' | 'boolean' | 'string' | 'on/off'>;
    /**
     * Custom elements lifecycle hooks
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * A URL fragment pointing to the directory containing the fonts
     * necessary to render a formula.
     *
     * These fonts are available in the `/dist/fonts` directory of the SDK.
     *
     * Customize this value to reflect where you have copied these fonts,
     * or to use the CDN version.
     *
     * The default value is `"./fonts"`. Use `null` to prevent
     * any fonts from being loaded.
     *
     * Changing this setting after the mathfield has been created will have
     * no effect.
     *
     * ```javascript
     * {
     *      // Use the CDN version
     *      fontsDirectory: ''
     * }
     * ```
     *
     * ```javascript
     * {
     *      // Use a directory called "fonts", located next to the
     *      // `mathlive.js` (or `mathlive.mjs`) file.
     *      fontsDirectory: './fonts'
     * }
     * ```
     *
     * ```javascript
     * {
     *      // Use a directory located at the root of your website
     *      fontsDirectory: 'https://example.com/fonts'
     * }
     * ```
     *
     */
    static get fontsDirectory(): string | null;
    static set fontsDirectory(value: string | null);
    static _fontsDirectory: string | null;
    /**
     * A URL fragment pointing to the directory containing the optional
     * sounds used to provide feedback while typing.
     *
     * Some default sounds are available in the `/dist/sounds` directory of the SDK.
     *
     * Use `null` to prevent any sound from being loaded.
     *
     */
    static get soundsDirectory(): string | null;
    static set soundsDirectory(value: string | null);
    static _soundsDirectory: string | null;
    /**
     * When a key on the virtual keyboard is pressed, produce a short haptic
     * feedback, if the device supports it.
     */
    static keypressVibration: boolean;
    /**
     * When a key on the virtual keyboard is pressed, produce a short audio
     * feedback.
     *
     * If the property is set to a `string`, the same sound is played in all
     * cases. Otherwise, a distinct sound is played:
     *
     * -   `delete` a sound played when the delete key is pressed
     * -   `return` ... when the return/tab key is pressed
     * -   `spacebar` ... when the spacebar is pressed
     * -   `default` ... when any other key is pressed. This property is required,
     *     the others are optional. If they are missing, this sound is played as
     *     well.
     *
     * The value of the properties should be either a string, the name of an
     * audio file in the `soundsDirectory` directory or `null` to suppress the sound.
     */
    static get keypressSound(): {
        spacebar: null | string;
        return: null | string;
        delete: null | string;
        default: null | string;
    };
    static set keypressSound(value: null | string | {
        spacebar?: null | string;
        return?: null | string;
        delete?: null | string;
        default: null | string;
    });
    static _keypressSound: {
        spacebar: null | string;
        return: null | string;
        delete: null | string;
        default: null | string;
    };
    /**
     * Sound played to provide feedback when a command has no effect, for example
     * when pressing the spacebar at the root level.
     *
     * The property is either:
     * - a string, the name of an audio file in the `soundsDirectory` directory
     * - null to turn off the sound
     */
    static _plonkSound: string | null;
    static get plonkSound(): string | null;
    static set plonkSound(value: string | null);
    /** @internal */
    static audioBuffers: {
        [key: string]: AudioBuffer;
    };
    /** @internal */
    static _audioContext: AudioContext;
    static get audioContext(): AudioContext;
    /**
     * Support for [Trusted Type](https://w3c.github.io/webappsec-trusted-types/dist/spec/).
     *
     * This optional function will be called before a string of HTML is
     * injected in the DOM, allowing that string to be sanitized
     * according to a policy defined by the host.
     */
    static createHTML: (html: string) => any;
    /**
     * Indicates which speech engine to use for speech output.
     *
     * Use `local` to use the OS-specific TTS engine.
     *
     * Use `amazon` for Amazon Text-to-Speech cloud API. You must include the
     * AWS API library and configure it with your API key before use.
     *
     * **See**
     * {@link https://cortexjs.io/mathlive/guides/speech/ | Guide: Speech}
     */
    static get speechEngine(): 'local' | 'amazon';
    static set speechEngine(value: 'local' | 'amazon');
    /** @internal */
    private static _speechEngine;
    /**
     * Sets the speed of the selected voice.
     *
     * One of `x-slow`, `slow`, `medium`, `fast`, `x-fast` or a value as a
     * percentage.
     *
     * Range is `20%` to `200%` For example `200%` to indicate a speaking rate
     * twice the default rate.
     */
    static get speechEngineRate(): string;
    static set speechEngineRate(value: string);
    /** @internal */
    private static _speechEngineRate;
    /**
     * Indicates the voice to use with the speech engine.
     *
     * This is dependent on the speech engine. For Amazon Polly, see here:
     * https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
     *
     */
    static get speechEngineVoice(): string;
    static set speechEngineVoice(value: string);
    /** @internal */
    private static _speechEngineVoice;
    /**
     * The markup syntax to use for the output of conversion to spoken text.
     *
     * Possible values are `ssml` for the SSML markup or `mac` for the macOS
     * markup, i.e. `&#91;&#91;ltr&#93;&#93;`.
     *
     */
    static get textToSpeechMarkup(): '' | 'ssml' | 'ssml_step' | 'mac';
    static set textToSpeechMarkup(value: '' | 'ssml' | 'ssml_step' | 'mac');
    /** @internal */
    private static _textToSpeechMarkup;
    /**
     * Specify which set of text to speech rules to use.
     *
     * A value of `mathlive` indicates that the simple rules built into MathLive
     * should be used.
     *
     * A value of `sre` indicates that the Speech Rule Engine from Volker Sorge
     * should be used.
     *
     * **(Caution)** SRE is not included or loaded by MathLive. For this option to
     * work SRE should be loaded separately.
     *
     * **See**
     * {@link https://cortexjs.io/mathlive/guides/speech/ | Guide: Speech}
     */
    static get textToSpeechRules(): 'mathlive' | 'sre';
    static set textToSpeechRules(value: 'mathlive' | 'sre');
    /** @internal */
    private static _textToSpeechRules;
    /**
     * A set of key/value pairs that can be used to configure the speech rule
     * engine.
     *
     * Which options are available depends on the speech rule engine in use.
     * There are no options available with MathLive's built-in engine. The
     * options for the SRE engine are documented
     * {@link https://github.com/zorkow/speech-rule-engine | here}
     */
    static get textToSpeechRulesOptions(): Record<string, string>;
    static set textToSpeechRulesOptions(value: Record<string, string>);
    /** @internal */
    private static _textToSpeechRulesOptions;
    static speakHook: (text: string) => void;
    static readAloudHook: (element: HTMLElement, text: string) => void;
    /**
     * The locale (language + region) to use for string localization.
     *
     * If none is provided, the locale of the browser is used.
     *
     */
    static get locale(): string;
    static set locale(value: string);
    /**
     * The symbol used to separate the integer part from the fractional part of a
     * number.
     *
     * When `","` is used, the corresponding LaTeX string is `{,}`, in order
     * to ensure proper spacing (otherwise an extra gap is displayed after the
     * comma).
     *
     * This affects:
     * - what happens when the `,` key is pressed (if `decimalSeparator` is
     * `","`, the `{,}` LaTeX string is inserted when following some digits)
     * - the label and behavior of the "." key in the default virtual keyboard
     *
     * **Default**: `"."`
     */
    static get decimalSeparator(): ',' | '.';
    static set decimalSeparator(value: ',' | '.');
    /** @internal */
    private static _decimalSeparator;
    /**
     * When using the keyboard to navigate a fraction, the order in which the
     * numerator and navigator are traversed:
     * - "numerator-denominator": first the elements in the numerator, then
     *   the elements in the denominator.
     * - "denominator-numerator": first the elements in the denominator, then
     *   the elements in the numerator. In some East-Asian cultures, fractions
     *   are read and written denominator first ("fēnzhī"). With this option
     *   the keyboard navigation follows this convention.
     *
     * **Default**: `"numerator-denominator"`
     */
    static fractionNavigationOrder: 'numerator-denominator' | 'denominator-numerator';
    /**
    * An object whose keys are a locale string, and whose values are an object of
    * string identifier to localized string.
    *
    * **Example**
    *
    ```json
    {
      "fr-CA": {
          "tooltip.undo": "Annuler",
          "tooltip.redo": "Refaire",
      }
    }
    ```
    *
    * This will override the default localized strings.
    */
    static get strings(): Record<string, Record<string, string>>;
    static set strings(value: Record<string, Record<string, string>>);
    /**
     * A custom compute engine instance. If none is provided, a default one is
     * used. If `null` is specified, no compute engine is used.
     */
    static get computeEngine(): ComputeEngine | null;
    static set computeEngine(value: ComputeEngine | null);
    /** @internal */
    private static _computeEngine;
    static loadSound(sound: 'plonk' | 'keypress' | 'spacebar' | 'delete' | 'return'): Promise<void>;
    static playSound(name: 'keypress' | 'spacebar' | 'delete' | 'plonk' | 'return'): Promise<void>;
    /** @internal */
    private _mathfield;
    /** @internal
     * Supported by some browser: allows some (static) attributes to be set
     * without being reflected on the element instance.
     */
    private _internals;
    /**
       * To create programmatically a new mathfield use:
       *
       ```javascript
      let mfe = new MathfieldElement();
  
      // Set initial value and options
      mfe.value = "\\frac{\\sin(x)}{\\cos(x)}";
  
      // Options can be set either as an attribute (for simple options)...
      mfe.setAttribute("letter-shape-style", "french");
  
      // ... or using properties
      mfe.letterShapeStyle = "french";
  
      // Attach the element to the DOM
      document.body.appendChild(mfe);
      ```
      */
    constructor(options?: Partial<MathfieldOptions>);
    onPointerDown(): void;
    getPromptValue(placeholderId: string): string;
    /** Return the id of the prompts matching the filter */
    getPrompts(filter?: {
        id?: string;
        locked?: boolean;
        correctness?: 'correct' | 'incorrect' | 'undefined';
    }): string[];
    get form(): HTMLFormElement | null;
    get name(): string;
    get type(): string;
    get mode(): ParseMode;
    set mode(value: ParseMode);
    /**
     * If the Compute Engine library is available, return a boxed MathJSON expression representing the value of the mathfield.
     *
     * To load the Compute Engine library, use:
     * ```js
  import 'https://unpkg.com/@cortex-js/compute-engine?module';
  ```
     *
     */
    get expression(): any | null;
    set expression(mathJson: Expression | any);
    get errors(): LatexSyntaxError[];
    /** @internal */
    private _getOptions;
    /**
     *  @category Options
     *  @deprecated
     */
    private getOptions;
    /** @internal */
    private reflectAttributes;
    /**
     *  @category Options
     * @deprecated
     */
    private getOption;
    /** @internal */
    private _getOption;
    /** @internal */
    private _setOptions;
    /**
     *  @category Options
     * @deprecated
     */
    private setOptions;
    /**
     * @inheritdoc Mathfield.executeCommand
     */
    executeCommand(command: Selector | [Selector, ...any[]]): boolean;
    /**
     * @inheritdoc Mathfield.getValue
     * @category Accessing and changing the content
     */
    getValue(format?: OutputFormat): string;
    getValue(start: Offset, end: Offset, format?: OutputFormat): string;
    getValue(range: Range, format?: OutputFormat): string;
    getValue(selection: Selection, format?: OutputFormat): string;
    /**
     * @inheritdoc Mathfield.setValue
     * @category Accessing and changing the content
     */
    setValue(value?: string, options?: InsertOptions): void;
    /**
     * @inheritdoc Mathfield.hasFocus
     *
     * @category Focus
     *
     */
    hasFocus(): boolean;
    /**
     * Sets the focus to the mathfield (will respond to keyboard input).
     *
     * @category Focus
     *
     */
    focus(): void;
    /**
     * Remove the focus from the mathfield (will no longer respond to keyboard
     * input).
     *
     * @category Focus
     *
     */
    blur(): void;
    /**
     * Select the content of the mathfield.
     * @category Selection
     */
    select(): void;
    /**
     * @inheritdoc Mathfield.insert
  
     *  @category Accessing and changing the content
     */
    insert(s: string, options?: InsertOptions): boolean;
    /**
     * @inheritdoc Mathfield.applyStyle
     *
     * @category Accessing and changing the content
     */
    applyStyle(style: Style, options?: Range | {
        range?: Range;
        operation?: 'set' | 'toggle';
    }): void;
    /**
     * The bottom location of the caret (insertion point) in viewport
     * coordinates.
     *
     * @category Selection
     */
    get caretPoint(): null | {
        x: number;
        y: number;
    };
    set caretPoint(point: null | {
        x: number;
        y: number;
    });
    /**
     * `x` and `y` are in viewport coordinates.
     *
     * Return true if the location of the point is a valid caret location.
     *
     * See also [[`caretPoint`]]
     * @category Selection
     */
    setCaretPoint(x: number, y: number): boolean;
    /** The offset closest to the location `(x, y)` in viewport coordinate.
     *
     * **`bias`**:  if `0`, the vertical midline is considered to the left or
     * right sibling. If `-1`, the left sibling is favored, if `+1`, the right
     * sibling is favored.
     *
     * @category Selection
     */
    offsetFromPoint(x: number, y: number, options?: {
        bias?: -1 | 0 | 1;
    }): Offset;
    /** The bounding rect of the atom at offset
     *
     * @category Selection
     *
     */
    hitboxFromOffset(offset: number): DOMRect | null;
    /**
     * Reset the undo stack
     * (for parent components with their own undo/redo)
     */
    resetUndo(): void;
    /**
     * Return whether there are undoable items
     * (for parent components with their own undo/redo)
     */
    canUndo(): boolean;
    /**
     * Return whether there are redoable items
     * (for parent components with their own undo/redo)
     */
    canRedo(): boolean;
    handleEvent(evt: Event): void;
    /**
     * Custom elements lifecycle hooks
     * @internal
     */
    connectedCallback(): void;
    /**
     * Custom elements lifecycle hooks
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Private lifecycle hooks
     * @internal
     */
    upgradeProperty(prop: string): void;
    /**
     * Custom elements lifecycle hooks
     * @internal
     */
    attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void;
    get readonly(): boolean;
    set readonly(value: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * The content of the mathfield as a LaTeX expression.
     * ```js
     * document.querySelector('mf').value = '\\frac{1}{\\pi}'
     * ```
     *  @category Accessing and changing the content
     */
    get value(): string;
    /**
     *  @category Accessing and changing the content
     */
    set value(value: string);
    get defaultMode(): 'inline-math' | 'math' | 'text';
    set defaultMode(value: 'inline-math' | 'math' | 'text');
    get macros(): MacroDictionary;
    set macros(value: MacroDictionary);
    get registers(): Registers;
    set registers(value: Registers);
    get colorMap(): (name: string) => string | undefined;
    set colorMap(value: (name: string) => string | undefined);
    get backgroundColorMap(): (name: string) => string | undefined;
    set backgroundColorMap(value: (name: string) => string | undefined);
    get letterShapeStyle(): 'auto' | 'tex' | 'iso' | 'french' | 'upright';
    set letterShapeStyle(value: 'auto' | 'tex' | 'iso' | 'french' | 'upright');
    get minFontScale(): number;
    set minFontScale(value: number);
    get smartMode(): boolean;
    set smartMode(value: boolean);
    get smartFence(): boolean;
    set smartFence(value: boolean);
    get smartSuperscript(): boolean;
    set smartSuperscript(value: boolean);
    get scriptDepth(): number | [number, number];
    set scriptDepth(value: number | [number, number]);
    get removeExtraneousParentheses(): boolean;
    set removeExtraneousParentheses(value: boolean);
    get mathModeSpace(): string;
    set mathModeSpace(value: string);
    get placeholderSymbol(): string;
    set placeholderSymbol(value: string);
    get popoverPolicy(): 'auto' | 'off';
    set popoverPolicy(value: 'auto' | 'off');
    get mathVirtualKeyboardPolicy(): VirtualKeyboardPolicy;
    set mathVirtualKeyboardPolicy(value: VirtualKeyboardPolicy);
    get inlineShortcuts(): InlineShortcutDefinitions;
    set inlineShortcuts(value: InlineShortcutDefinitions);
    get inlineShortcutTimeout(): number;
    set inlineShortcutTimeout(value: number);
    get keybindings(): Keybinding[];
    set keybindings(value: Keybinding[]);
    get onInlineShortcut(): (sender: Mathfield, symbol: string) => string;
    set onInlineShortcut(value: (sender: Mathfield, symbol: string) => string);
    get onScrollIntoView(): ((sender: Mathfield) => void) | null;
    set onScrollIntoView(value: ((sender: Mathfield) => void) | null);
    get onExport(): (from: Mathfield, latex: string, range: Range) => string;
    set onExport(value: (from: Mathfield, latex: string, range: Range) => string);
    get readOnly(): boolean;
    set readOnly(value: boolean);
    get isSelectionEditable(): boolean;
    setPromptState(id: string, state: 'correct' | 'incorrect' | 'undefined' | undefined, locked?: boolean): void;
    getPromptState(id: string): ['correct' | 'incorrect' | undefined, boolean];
    setPromptContent(id: string, content: string, insertOptions: Omit<InsertOptions, 'insertionMode'>): void;
    /** Remove the contents of all prompts, and return an object with the prompt contents */
    stripPromptContent(filter?: {
        id?: string;
        locked?: boolean;
        correctness?: 'correct' | 'incorrect' | 'undefined';
    }): Record<string, string>;
    get virtualKeyboardTargetOrigin(): string;
    set virtualKeyboardTargetOrigin(value: string);
    /**
     * An array of ranges representing the selection.
     *
     * It is guaranteed there will be at least one element. If a discontinuous
     * selection is present, the result will include more than one element.
     *
     * @category Selection
     *
     */
    get selection(): Selection;
    /**
     *
     * @category Selection
     */
    set selection(sel: Selection | Offset);
    get selectionIsCollapsed(): boolean;
    /**
     * The position of the caret/insertion point, from 0 to `lastOffset`.
     *
     * @category Selection
     *
     */
    get position(): Offset;
    /**
     * @category Selection
     */
    set position(offset: Offset);
    /**
     * The depth of an offset represent the depth in the expression tree.
     */
    getOffsetDepth(offset: Offset): number;
    /**
     * The last valid offset.
     * @category Selection
     */
    get lastOffset(): Offset;
}
export default MathfieldElement;
declare global {
    interface Window {
        MathfieldElement: typeof MathfieldElement;
    }
}
