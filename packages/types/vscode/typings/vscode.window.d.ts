declare module 'vscode' {

  export interface OutputChannel {

		/**
		 * The human-readable name of this output channel.
		 */
    readonly name: string;

		/**
		 * Append the given value to the channel.
		 *
		 * @param value A string, falsy values will not be printed.
		 */
    append(value: string): void;

		/**
		 * Append the given value and a line feed character
		 * to the channel.
		 *
		 * @param value A string, falsy values will be printed.
		 */
    appendLine(value: string): void;

		/**
		 * Removes all output from the channel.
		 */
    clear(): void;

		/**
		 * Reveal this channel in the UI.
		 *
		 * @param preserveFocus When `true` the channel will not take focus.
		 */
    show(preserveFocus?: boolean): void;

		/**
		 * ~~Reveal this channel in the UI.~~
		 *
		 * @deprecated Use the overload with just one parameter (`show(preserveFocus?: boolean): void`).
		 *
		 * @param column This argument is **deprecated** and will be ignored.
		 * @param preserveFocus When `true` the channel will not take focus.
		 */
    show(column?: ViewColumn, preserveFocus?: boolean): void;

		/**
		 * Hide this channel from the UI.
		 */
    hide(): void;

		/**
		 * Dispose and free associated resources.
		 */
    dispose(): void;
  }

  /**
	 * Options to configure the behaviour of a file open dialog.
	 *
	 * * Note 1: A dialog can select files, folders, or both. This is not true for Windows
	 * which enforces to open either files or folder, but *not both*.
	 * * Note 2: Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
	 * and the editor then silently adjusts the options to select files.
	 */
  export interface OpenDialogOptions {
		/**
		 * The resource the dialog shows when opened.
		 */
    defaultUri?: Uri;

		/**
		 * A human-readable string for the open button.
		 */
    openLabel?: string;

		/**
		 * Allow to select files, defaults to `true`.
		 */
    canSelectFiles?: boolean;

		/**
		 * Allow to select folders, defaults to `false`.
		 */
    canSelectFolders?: boolean;

		/**
		 * Allow to select many files or folders.
		 */
    canSelectMany?: boolean;

		/**
		 * A set of file filters that are used by the dialog. Each entry is a human readable label,
		 * like "TypeScript", and an array of extensions, e.g.
		 * ```ts
		 * {
		 * 	'Images': ['png', 'jpg']
		 * 	'TypeScript': ['ts', 'tsx']
		 * }
		 * ```
		 */
    filters?: { [name: string]: string[] };
  }

	/**
	 * Options to configure the behaviour of a file save dialog.
	 */
  export interface SaveDialogOptions {
		/**
		 * The resource the dialog shows when opened.
		 */
    defaultUri?: Uri;

		/**
		 * A human-readable string for the save button.
		 */
    saveLabel?: string;

		/**
		 * A set of file filters that are used by the dialog. Each entry is a human readable label,
		 * like "TypeScript", and an array of extensions, e.g.
		 * ```ts
		 * {
		 * 	'Images': ['png', 'jpg']
		 * 	'TypeScript': ['ts', 'tsx']
		 * }
		 * ```
		 */
    filters?: { [name: string]: string[] };
  }
  export namespace window {

		/**
		 * Creates a new [output channel](#OutputChannel) with the given name.
		 *
		 * @param name Human-readable string which will be used to represent the channel in the UI.
		 */
    export function createOutputChannel(name: string): OutputChannel;

		/**
		 * The currently opened terminals or an empty array.
		 */
    export const terminals: ReadonlyArray<Terminal>;

		/**
		 * The currently active terminal or `undefined`. The active terminal is the one that
		 * currently has focus or most recently had focus.
		 */
    export const activeTerminal: Terminal | undefined;

		/**
		 * An [event](#Event) which fires when the [active terminal](#window.activeTerminal)
		 * has changed. *Note* that the event also fires when the active terminal changes
		 * to `undefined`.
		 */
    export const onDidChangeActiveTerminal: Event<Terminal | undefined>;

		/**
		 * An [event](#Event) which fires when a terminal has been created, either through the
		 * [createTerminal](#window.createTerminal) API or commands.
		 */
    export const onDidOpenTerminal: Event<Terminal>;

		/**
		 * An [event](#Event) which fires when a terminal is disposed.
		 */
    export const onDidCloseTerminal: Event<Terminal>;


		/**
		 * Represents the current window's state.
		 */
    export const state: WindowState;

		/**
		 * An [event](#Event) which fires when the focus state of the current window
		 * changes. The value of the event represents whether the window is focused.
		 */
    export const onDidChangeWindowState: Event<WindowState>;

		/**
		 * Creates a [Terminal](#Terminal). The cwd of the terminal will be the workspace directory
		 * if it exists, regardless of whether an explicit customStartPath setting exists.
		 *
		 * @param name Optional human-readable string which will be used to represent the terminal in the UI.
		 * @param shellPath Optional path to a custom shell executable to be used in the terminal.
		 * @param shellArgs Optional args for the custom shell executable. A string can be used on Windows only which
		 * allows specifying shell args in [command-line format](https://msdn.microsoft.com/en-au/08dfcab2-eb6e-49a4-80eb-87d4076c98c6).
		 * @return A new Terminal.
		 */
    export function createTerminal(name?: string, shellPath?: string, shellArgs?: string[] | string): Terminal;

		/**
		 * Create and show a new webview panel.
		 *
		 * @param viewType Identifies the type of the webview panel.
		 * @param title Title of the panel.
		 * @param showOptions Where to show the webview in the editor. If preserveFocus is set, the new webview will not take focus.
		 * @param options Settings for the new panel.
		 *
		 * @return New webview panel.
		 */
    export function createWebviewPanel(viewType: string, title: string, showOptions: ViewColumn | { viewColumn: ViewColumn, preserveFocus?: boolean }, options?: WebviewPanelOptions & WebviewOptions): WebviewPanel;

    /**
     * Registers a webview panel serializer.
     *
     * Extensions that support reviving should have an `"onWebviewPanel:viewType"` activation event and
     * make sure that [registerWebviewPanelSerializer](#registerWebviewPanelSerializer) is called during activation.
     *
     * Only a single serializer may be registered at a time for a given `viewType`.
     *
     * @param viewType Type of the webview panel that can be serialized.
     * @param serializer Webview serializer.
     */
    export function registerWebviewPanelSerializer(viewType: string, serializer: WebviewPanelSerializer): Disposable;

		/**
		 * ~~Show progress in the Source Control viewlet while running the given callback and while
		 * its returned promise isn't resolve or rejected.~~
		 *
		 * @deprecated Use `withProgress` instead.
		 *
		 * @param task A callback returning a promise. Progress increments can be reported with
		 * the provided [progress](#Progress)-object.
		 * @return The thenable the task did return.
		 */
    export function withScmProgress<R>(task: (progress: Progress<number>) => Thenable<R>): Thenable<R>;

		/**
		 * Show progress in the editor. Progress is shown while running the given callback
		 * and while the promise it returned isn't resolved nor rejected. The location at which
		 * progress should show (and other details) is defined via the passed [`ProgressOptions`](#ProgressOptions).
		 *
		 * @param task A callback returning a promise. Progress state can be reported with
		 * the provided [progress](#Progress)-object.
		 *
		 * To report discrete progress, use `increment` to indicate how much work has been completed. Each call with
		 * a `increment` value will be summed up and reflected as overall progress until 100% is reached (a value of
		 * e.g. `10` accounts for `10%` of work done).
		 * Note that currently only `ProgressLocation.Notification` is capable of showing discrete progress.
		 *
		 * To monitor if the operation has been cancelled by the user, use the provided [`CancellationToken`](#CancellationToken).
		 * Note that currently only `ProgressLocation.Notification` is supporting to show a cancel button to cancel the
		 * long running operation.
		 *
		 * @return The thenable the task-callback returned.
		 */
    export function withProgress<R>(options: ProgressOptions, task: (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => Thenable<R>): Thenable<R>;

    /**
     * Register a [TreeDataProvider](#TreeDataProvider) for the view contributed using the extension point `views`.
     * This will allow you to contribute data to the [TreeView](#TreeView) and update if the data changes.
     *
     * **Note:** To get access to the [TreeView](#TreeView) and perform operations on it, use [createTreeView](#window.createTreeView).
     *
     * @param viewId Id of the view contributed using the extension point `views`.
     * @param treeDataProvider A [TreeDataProvider](#TreeDataProvider) that provides tree data for the view
     */
    export function registerTreeDataProvider<T>(viewId: string, treeDataProvider: TreeDataProvider<T>): Disposable;

		/**
		 * Create a [TreeView](#TreeView) for the view contributed using the extension point `views`.
		 * @param viewId Id of the view contributed using the extension point `views`.
		 * @param options Options for creating the [TreeView](#TreeView)
		 * @returns a [TreeView](#TreeView).
		 */
    export function createTreeView<T>(viewId: string, options: TreeViewOptions<T>): TreeView<T>;

		/**
		 * Options for creating a [TreeView](#TreeView)
		 */
    export interface TreeViewOptions<T> {

			/**
			 * A data provider that provides tree data.
			 */
      treeDataProvider: TreeDataProvider<T>;

			/**
			 * Whether to show collapse all action or not.
			 */
      showCollapseAll?: boolean;
    }
    /**
		 * Shows a file open dialog to the user which allows to select a file
		 * for opening-purposes.
		 *
		 * @param options Options that control the dialog.
		 * @returns A promise that resolves to the selected resources or `undefined`.
		 */
    export function showOpenDialog(options: OpenDialogOptions): Thenable<Uri[] | undefined>;

		/**
		 * Shows a file save dialog to the user which allows to select a file
		 * for saving-purposes.
		 *
		 * @param options Options that control the dialog.
		 * @returns A promise that resolves to the selected resource or `undefined`.
		 */
    export function showSaveDialog(options: SaveDialogOptions): Thenable<Uri | undefined>;
    /**
		 * Shows a selection list of [workspace folders](#workspace.workspaceFolders) to pick from.
		 * Returns `undefined` if no folder is open.
		 *
		 * @param options Configures the behavior of the workspace folder list.
		 * @return A promise that resolves to the workspace folder or `undefined`.
		 */
    export function showWorkspaceFolderPick(options?: WorkspaceFolderPickOptions): Thenable<WorkspaceFolder | undefined>;

    /**
		 * Registers a [uri handler](#UriHandler) capable of handling system-wide [uris](#Uri).
		 * In case there are multiple windows open, the topmost window will handle the uri.
		 * A uri handler is scoped to the extension it is contributed from; it will only
		 * be able to handle uris which are directed to the extension itself. A uri must respect
		 * the following rules:
		 *
		 * - The uri-scheme must be `vscode.env.uriScheme`;
		 * - The uri-authority must be the extension id (e.g. `my.extension`);
		 * - The uri-path, -query and -fragment parts are arbitrary.
		 *
		 * For example, if the `my.extension` extension registers a uri handler, it will only
		 * be allowed to handle uris with the prefix `product-name://my.extension`.
		 *
		 * An extension can only register a single uri handler in its entire activation lifetime.
		 *
		 * * *Note:* There is an activation event `onUri` that fires when a uri directed for
		 * the current extension is about to be handled.
		 *
		 * @param handler The uri handler to register for this extension.
		 */
    export function registerUriHandler(handler: UriHandler): Disposable;
  }

  /**
 * A panel that contains a webview.
 */
  interface WebviewPanel {
		/**
		 * Identifies the type of the webview panel, such as `'markdown.preview'`.
		 */
    readonly viewType: string;

		/**
		 * Title of the panel shown in UI.
		 */
    title: string;

		/**
		 * Icon for the panel shown in UI.
		 */
    iconPath?: Uri | { light: Uri; dark: Uri };

		/**
		 * Webview belonging to the panel.
		 */
    readonly webview: Webview;

		/**
		 * Content settings for the webview panel.
		 */
    readonly options: WebviewPanelOptions;

		/**
		 * Editor position of the panel. This property is only set if the webview is in
		 * one of the editor view columns.
		 */
    readonly viewColumn?: ViewColumn;

		/**
		 * Whether the panel is active (focused by the user).
		 */
    readonly active: boolean;

		/**
		 * Whether the panel is visible.
		 */
    readonly visible: boolean;

		/**
		 * Fired when the panel's view state changes.
		 */
    readonly onDidChangeViewState: Event<WebviewPanelOnDidChangeViewStateEvent>;

		/**
		 * Fired when the panel is disposed.
		 *
		 * This may be because the user closed the panel or because `.dispose()` was
		 * called on it.
		 *
		 * Trying to use the panel after it has been disposed throws an exception.
		 */
    readonly onDidDispose: Event<void>;

		/**
		 * Show the webview panel in a given column.
		 *
		 * A webview panel may only show in a single column at a time. If it is already showing, this
		 * method moves it to a new column.
		 *
		 * @param viewColumn View column to show the panel in. Shows in the current `viewColumn` if undefined.
		 * @param preserveFocus When `true`, the webview will not take focus.
		 */
    reveal(viewColumn?: ViewColumn, preserveFocus?: boolean): void;

		/**
		 * Dispose of the webview panel.
		 *
		 * This closes the panel if it showing and disposes of the resources owned by the webview.
		 * Webview panels are also disposed when the user closes the webview panel. Both cases
		 * fire the `onDispose` event.
		 */
    dispose(): any;
  }

  /**
   * Restore webview panels that have been persisted when vscode shuts down.
   *
   * There are two types of webview persistence:
   *
   * - Persistence within a session.
   * - Persistence across sessions (across restarts of VS Code).
   *
   * A `WebviewPanelSerializer` is only required for the second case: persisting a webview across sessions.
   *
   * Persistence within a session allows a webview to save its state when it becomes hidden
   * and restore its content from this state when it becomes visible again. It is powered entirely
   * by the webview content itself. To save off a persisted state, call `acquireVsCodeApi().setState()` with
   * any json serializable object. To restore the state again, call `getState()`
   *
   * ```js
   * // Within the webview
   * const vscode = acquireVsCodeApi();
   *
   * // Get existing state
   * const oldState = vscode.getState() || { value: 0 };
   *
   * // Update state
   * setState({ value: oldState.value + 1 })
   * ```
   *
   * A `WebviewPanelSerializer` extends this persistence across restarts of VS Code. When the editor is shutdown,
   * VS Code will save off the state from `setState` of all webviews that have a serializer. When the
   * webview first becomes visible after the restart, this state is passed to `deserializeWebviewPanel`.
   * The extension can then restore the old `WebviewPanel` from this state.
   */
  interface WebviewPanelSerializer {
		/**
		 * Restore a webview panel from its serialized `state`.
		 *
		 * Called when a serialized webview first becomes visible.
		 *
		 * @param webviewPanel Webview panel to restore. The serializer should take ownership of this panel. The
		 * serializer must restore the webview's `.html` and hook up all webview events.
		 * @param state Persisted state from the webview content.
		 *
		 * @return Thenable indicating that the webview has been fully restored.
		 */
    deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any): Thenable<void>;
  }

	/**
	 * Event fired when a webview panel's view state changes.
	 */
  export interface WebviewPanelOnDidChangeViewStateEvent {
		/**
		 * Webview panel whose view state changed.
		 */
    readonly webviewPanel: WebviewPanel;
  }

}
