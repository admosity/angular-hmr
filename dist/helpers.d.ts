export declare function bootloader(main: any): void;
export declare function createNewHosts(cmps: any): () => void;
export declare function removeNgStyles(): void;
/**
 * get input values
 *
 * Extended by: Gabriel Schuster <github.com@actra.de>
 * Now gets values of inputs (including "checked" status radios, checkboxes), textareas and selects (including multiselects)
 * Tries to identify the elements as exact as possible, falls back to numeric index when identification fails
 */
export declare function getInputValues(): any;
/**
 * set input values
 *
 * Extended by: Gabriel Schuster <github.com@actra.de>
 */
export declare function setInputValues($inputs: any): void;
export declare function createInputTransfer(): () => void;
