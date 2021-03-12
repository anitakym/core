import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { act } from 'react-dom/test-utils';
import {
  RecycleTree,
  IRecycleTreeHandle,
  INodeRendererWrapProps,
} from '@ali/ide-components';
import {
  DebugConsoleModelService,
  IDebugConsoleModel,
} from '@ali/ide-debug/lib/browser/view/console/debug-console-tree.model.service';
import { createBrowserInjector } from '@ali/ide-dev-tool/src/injector-helper';
import { WorkbenchEditorService } from '@ali/ide-editor';
import { IMessageService } from '@ali/ide-overlay';
import {
  DebugPreferences,
  DebugSessionContributionRegistry,
  DebugSessionFactory,
  DefaultDebugSessionFactory,
  DebugSession,
} from '@ali/ide-debug/lib/browser';
import { IFileServiceClient } from '@ali/ide-core-node';
import { ITerminalApiService } from '@ali/ide-terminal-next';
import { OutputService } from '@ali/ide-output/lib/browser/output.service';
import {
  DebugModelFactory,
  IDebugServer,
  IDebugSessionManager,
  IDebugSession,
  DebugSessionOptions,
} from '@ali/ide-debug';
import { IWorkspaceService } from '@ali/ide-workspace';
import { QuickPickService } from '@ali/ide-quick-open';
import { IEditorDocumentModelService } from '@ali/ide-editor/lib/browser';
import { WSChannelHandler } from '@ali/ide-connection';
import { IVariableResolverService } from '@ali/ide-variable';
import { ITaskService } from '@ali/ide-task';
import { DebugConsoleFilterService } from '@ali/ide-debug/lib/browser/view/console/debug-console-filter.service';
import {
  DebugConsoleNode,
  AnsiConsoleNode,
  DebugVariableContainer,
} from '@ali/ide-debug/lib/browser/tree';
import { IContextKeyService } from '@ali/ide-core-browser/src';
import { IMainLayoutService } from '@ali/ide-main-layout';
import { Disposable } from '@ali/ide-core-common';
import { LayoutService } from '@ali/ide-main-layout/lib/browser/layout.service';
import { DebugConsoleRenderedNode } from '@ali/ide-debug/lib/browser/view/console/debug-console.view';

describe('Debug console component Test Suites', () => {
  const mockInjector = createBrowserInjector([]);
  let debugConsoleModelService: DebugConsoleModelService;
  let debugConsoleFilterService: DebugConsoleFilterService;
  let debugSessionFactory: DebugSessionFactory;
  let container;

  const createMockSession = (
    sessionId: string,
    options: Partial<DebugSessionOptions>,
  ): IDebugSession => {
    return debugSessionFactory.get(sessionId, options as any);
  };

  const mockCtxMenuRenderer = {
    show: jest.fn(),
    onDidChangeContext: jest.fn(() => Disposable.create(() => { })),
  } as any;
  const mockDebugSessionManager = {
    onDidDestroyDebugSession: jest.fn(() => Disposable.create(() => { })),
    onDidChangeActiveDebugSession: jest.fn(() => Disposable.create(() => { })),
    currentSession: IDebugSession,
    updateCurrentSession: jest.fn((session: IDebugSession | undefined) => { }),
  };

  const DebugConsoleView = observer(
    ({
      tree,
      model,
    }: {
      tree: DebugConsoleModelService;
      model: IDebugConsoleModel;
    }) => {
      const [filterValue, setFilterValue] = React.useState<string>('');
      const wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();
      const handleTreeReady = (handle: IRecycleTreeHandle) => {
        tree.handleTreeHandler({
          ...handle,
          getModel: () => model?.treeModel!,
          hasDirectFocus: () => wrapperRef.current === document.activeElement,
        });
      };

      React.useEffect(() => {
        const filterDispose = debugConsoleFilterService.onDidValueChange(
          (value: string) => {
            setFilterValue(value);
          },
        );
        return () => {
          filterDispose.dispose();
        };
      }, []);

      const fuzzyOptions = () => {
        return {
          pre: '<match>',
          post: '</match>',
          extract: (
            node: DebugConsoleNode | AnsiConsoleNode | DebugVariableContainer,
          ) => {
            return node.description ? node.description : node.name;
          },
        };
      };
      if (!model) {
        return null;
      }
      return (
        <RecycleTree
          height={1024}
          width={1024}
          itemHeight={22}
          onReady={handleTreeReady}
          filter={filterValue}
          filterProvider={{ fuzzyOptions }}
          model={model!.treeModel}
          overflow={'auto'}
        >
          {(props: INodeRendererWrapProps) => {
            const decorations = tree.decorations.getDecorations(
              props.item as any,
            );
            return (
              <DebugConsoleRenderedNode
                item={props.item}
                itemType={props.itemType}
                decorations={decorations}
                onClick={() => { }}
                onTwistierClick={() => { }}
                onContextMenu={() => { }}
                defaultLeftPadding={14}
                leftPadding={8}
              />
            );
          }}
        </RecycleTree>
      );
    },
  );

  beforeEach(() => {
    mockInjector.overrideProviders({
      token: WorkbenchEditorService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: IMessageService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: DebugPreferences,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: IFileServiceClient,
      useValue: {
        onFilesChanged: jest.fn(),
      },
    });
    mockInjector.overrideProviders({
      token: ITerminalApiService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: OutputService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: DebugModelFactory,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: IWorkspaceService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: IDebugServer,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: QuickPickService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: IEditorDocumentModelService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: WSChannelHandler,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: DebugSessionContributionRegistry,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: IVariableResolverService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: ITaskService,
      useValue: {},
    });
    mockInjector.overrideProviders({
      token: IContextKeyService,
      useValue: mockCtxMenuRenderer,
    });
    mockInjector.overrideProviders({
      token: IDebugSessionManager,
      useValue: mockDebugSessionManager,
    });
    mockInjector.overrideProviders({
      token: IMainLayoutService,
      useClass: LayoutService,
    });
    mockInjector.overrideProviders({
      token: DebugSessionFactory,
      useClass: DefaultDebugSessionFactory,
    });

    debugSessionFactory = mockInjector.get(DefaultDebugSessionFactory);
    debugConsoleModelService = mockInjector.get(DebugConsoleModelService);
    debugConsoleFilterService = mockInjector.get(DebugConsoleFilterService);
    container = document.createElement('div');
    container.setAttribute('id', 'debugConsole');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    // ReactDOM.unmountComponentAtNode(container);
    container = null;
  });

  /**
   * 这块测试还在补 by @倾一
   */
  it('repl filter', async () => {
    const session = createMockSession('mock', {});
    // @ts-ignore
    mockDebugSessionManager.currentSession = session;
    const model = await debugConsoleModelService.initTreeModel(
      session as DebugSession,
    );
    const tree = debugConsoleModelService;

    act(() => {
      ReactDOM.render(
        <DebugConsoleView tree={tree} model={model!}></DebugConsoleView>,
        container,
      );
    });

    await tree.execute('ABCD\n');
    await tree.execute('EFGH\n');
    await tree.execute('KTTQL\n');
    await tree.execute('KATATAQAL\n');
    await tree.execute('🐜\n');

    debugConsoleFilterService.setFilterText('KTTQL');

  });
});