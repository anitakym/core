import { MockInjector } from '../../../../tools/dev-tool/src/mock-injector';
import { createBrowserInjector } from '../../../../tools/dev-tool/src/injector-helper';
import { URI, Disposable, IContextKeyService, StorageProvider, ILogger } from '@ali/ide-core-browser';
import { LabelService } from '@ali/ide-core-browser/lib/services';
import { WorkbenchEditorService } from '@ali/ide-editor';
import { MockContextKeyService } from '@ali/ide-monaco/lib/browser/mocks/monaco.context-key.service';
import { IThemeService } from '@ali/ide-theme';
import { IDecorationsService } from '@ali/ide-decoration';
import { ICtxMenuRenderer } from '@ali/ide-core-browser/lib/menu/next';
import { createMockedMonaco } from '@ali/ide-monaco/lib/__mocks__/monaco';
import { OpenedEditorModelService } from '../../src/browser/services/opened-editor-model.service';
import { EditorFile } from '../../src/browser/opened-editor-node.define';
import { OpenedEditorService } from '../../src/browser/services/opened-editor-tree.service';
import { OpenedEditorDecorationService } from '../../src/browser/services/opened-editor-decoration.service';
import * as styles from '../../src/browser/file-tree-node.modules.less';

describe('OpenedEditorModelService should be work', () => {
  (global as any).monaco = createMockedMonaco() as any;
  let injector: MockInjector;
  let openedEditorModelService: OpenedEditorModelService;
  let openedEditorService: OpenedEditorService;
  const rootUri = URI.file('/userhome');
  const mockWatcher = {
    callback: jest.fn(),
  };
  const mockRoot = {
    watcher: {
      on: jest.fn(() => Disposable.create(() => { })),
      notifyDidChangeMetadata: jest.fn(),
    },
    watchEvents: {
      get: jest.fn(() => mockWatcher),
    },
    path: 'testRoot',
    uri: rootUri,
  } as any;
  const mockCtxMenuRenderer = {
    show: jest.fn(),
  } as any;
  const mockDecorationsService = {
    onDidChangeDecorations: jest.fn(() => Disposable.create(() => {})),
  };
  const mockThemeService = {
    onThemeChange: jest.fn(() => Disposable.create(() => {})),
  };
  const mockWorkbenchEditorService = {
    onActiveResourceChange: jest.fn(() => Disposable.create(() => { })),
    onDidEditorGroupsChanged: jest.fn(() => Disposable.create(() => { })),
    onDidCurrentEditorGroupChanged: jest.fn(() => Disposable.create(() => { })),
    onDidDecorationChange: jest.fn(() => Disposable.create(() => { })),
  };
  const mockExploreStorage = {
    get: jest.fn(() => {
      return {
        specVersion: 1,
        scrollPosition: 100,
        expandedDirectories: {
          atSurface: [],
          buried: [],
        },
      };
    }),
    set: jest.fn(),
  };
  const mockLabelService = {
    onDidChange: jest.fn(() => Disposable.create(() => {})),
  };
  const mockOpenedEditorService = {
    on: jest.fn(),
    onNodeRefreshed: jest.fn(() => Disposable.create(() => {})),
    onDirtyNodesChange: jest.fn(() => Disposable.create(() => {})),
    resolveChildren: jest.fn(() => {
      return [mockRoot];
    }),
    requestFlushEventSignalEvent: jest.fn(() => Disposable.create(() => {})),
    startWatchFileEvent: jest.fn(),
    refresh: jest.fn(),
    contextMenuContextKeyService: new MockContextKeyService().createScoped({} as any),
  };
  beforeEach(async (done) => {
    injector = createBrowserInjector([]);

    injector.overrideProviders(
      {
        token: OpenedEditorModelService,
        useClass: OpenedEditorModelService,
      },
      {
        token: OpenedEditorDecorationService,
        useClass: OpenedEditorDecorationService,
      },
      {
        token: LabelService,
        useValue: mockLabelService,
      },
      {
        token: ICtxMenuRenderer,
        useValue: mockCtxMenuRenderer,
      },
      {
        token: ILogger,
        useValue: console,
      },
      {
        token: OpenedEditorService,
        useValue: mockOpenedEditorService,
      },
      {
        token: StorageProvider,
        useValue: () => mockExploreStorage,
      },
      {
        token: IDecorationsService,
        useValue: mockDecorationsService,
      },
      {
        token: IThemeService,
        useValue: mockThemeService,
      },
      {
        token: IContextKeyService,
        useClass: MockContextKeyService,
      },
      {
        token: WorkbenchEditorService,
        useValue: mockWorkbenchEditorService,
      },
    );

    openedEditorService = injector.get(OpenedEditorService);
    openedEditorModelService = injector.get(OpenedEditorModelService);
    await openedEditorModelService.whenReady;
    done();
  });

  afterEach(() => {
    injector.disposeAll();
  });

  it('should init success', () => {
    expect(mockLabelService.onDidChange).toBeCalledTimes(1);
    expect(mockThemeService.onThemeChange).toBeCalledTimes(1);
    expect(mockDecorationsService.onDidChangeDecorations).toBeCalledTimes(1);
    expect(openedEditorModelService.treeModel).toBeDefined();
  });

  it('activeFileDecoration method should be work', () => {
    openedEditorModelService.initDecorations(mockRoot);
    const node = new EditorFile(openedEditorService, {
      uri: mockRoot.uri.resolve('test.js').toString(),
      name: 'test',
      icon: '',
    }, 'tooltip', mockRoot);
    openedEditorModelService.activeFileDecoration(node);
    const decoration = openedEditorModelService.decorations.getDecorations(node);
    expect(decoration).toBeDefined();
    expect(decoration!.classlist).toEqual([styles.mod_selected, styles.mod_focused]);
  });

  it('activeFileActivedDecoration method should be work', () => {
    openedEditorModelService.initDecorations(mockRoot);
    const node = new EditorFile(openedEditorService, {
      uri: mockRoot.uri.resolve('test.js').toString(),
      name: 'test',
      icon: '',
    }, 'tooltip', mockRoot);
    openedEditorModelService.activeFileActivedDecoration(node);
    const decoration = openedEditorModelService.decorations.getDecorations(node);
    expect(decoration).toBeDefined();
    expect(decoration!.classlist).toEqual([styles.mod_actived]);
  });

  it('selectFileDecoration method should be work', () => {
    openedEditorModelService.initDecorations(mockRoot);
    const node = new EditorFile(openedEditorService, {
      uri: mockRoot.uri.resolve('test.js').toString(),
      name: 'test',
      icon: '',
    }, 'tooltip', mockRoot);
    openedEditorModelService.selectFileDecoration(node);
    const decoration = openedEditorModelService.decorations.getDecorations(node);
    expect(decoration).toBeDefined();
    expect(decoration!.classlist).toEqual([styles.mod_selected]);
  });

  it('enactiveFileDecoration method should be work', () => {
    openedEditorModelService.initDecorations(mockRoot);
    const node = new EditorFile(openedEditorService, {
      uri: mockRoot.uri.resolve('test.js').toString(),
      name: 'test',
      icon: '',
    }, 'tooltip', mockRoot);
    openedEditorModelService.activeFileDecoration(node);
    let decoration = openedEditorModelService.decorations.getDecorations(node);
    expect(decoration).toBeDefined();
    expect(decoration!.classlist).toEqual([styles.mod_selected, styles.mod_focused]);
    openedEditorModelService.enactiveFileDecoration();
    decoration = openedEditorModelService.decorations.getDecorations(node);
    expect(decoration).toBeDefined();
    expect(decoration!.classlist).toEqual([styles.mod_selected]);
  });

  it('removeFileDecoration method should be work', () => {
    openedEditorModelService.initDecorations(mockRoot);
    const node = new EditorFile(openedEditorService, {
      uri: mockRoot.uri.resolve('test.js').toString(),
      name: 'test',
      icon: '',
    }, 'tooltip', mockRoot);
    openedEditorModelService.activeFileDecoration(node);
    let decoration = openedEditorModelService.decorations.getDecorations(node);
    openedEditorModelService.removeFileDecoration();
    decoration = openedEditorModelService.decorations.getDecorations(node);
    expect(decoration).toBeDefined();
    expect(decoration!.classlist).toEqual([]);
  });

  it('handleTreeBlur method should be work', () => {
    openedEditorModelService.initDecorations(mockRoot);
    const node = new EditorFile(openedEditorService, {
      uri: mockRoot.uri.resolve('test.js').toString(),
      name: 'test',
      icon: '',
    }, 'tooltip', mockRoot);
    openedEditorModelService.initDecorations(mockRoot);
    openedEditorModelService.activeFileDecoration(node);
    let decoration = openedEditorModelService.decorations.getDecorations(node);
    expect(decoration).toBeDefined();
    expect(decoration!.classlist).toEqual([styles.mod_selected, styles.mod_focused]);
    openedEditorModelService.handleTreeBlur();
    decoration = openedEditorModelService.decorations.getDecorations(node);
    expect(decoration).toBeDefined();
    expect(decoration!.classlist).toEqual([styles.mod_selected]);
  });

  it('handleContextMenu method should be work', () => {
    const node = new EditorFile(openedEditorService, {
      uri: mockRoot.uri.resolve('test.js').toString(),
      name: 'test',
      icon: '',
    }, 'tooltip', mockRoot);
    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
      nativeEvent: {
        x: 1,
        y: 1,
      },
    } as any;
    openedEditorModelService.handleContextMenu(mockEvent, node);
    expect(mockCtxMenuRenderer.show).toBeCalledTimes(1);
    expect(mockEvent.stopPropagation).toBeCalledTimes(1);
    expect(mockEvent.preventDefault).toBeCalledTimes(1);
  });
});