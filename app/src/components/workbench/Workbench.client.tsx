import { useStore } from '@nanostores/react';
import { motion, type Variants } from 'framer-motion';
import { computed } from 'nanostores';
import { memo, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { renderLogger } from '~/utils/logger';
import { WORK_DIR } from '~/utils/constants';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import { Preview } from '~/components/workbench/Preview';
import { DEFAULT_TERMINAL_SIZE, TerminalTabs } from '~/components/workbench/terminal/TerminalTabs';
import { workbenchStore, type WorkbenchViewType } from '~/lib/stores/workbench';
import { FileTree } from './FileTree';
import { useImportGit } from '~/components/workbench/useImportGit';

interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
  metadata?: {
    gitUrl?: string;
  };
  updateChatMestaData?: (metadata: any) => void;
}

const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;

const workbenchVariants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: 'var(--workbench-width)',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

export const Workbench = memo(({ metadata: _metadata, updateChatMestaData: _updateChatMestaData }: WorkspaceProps) => {
  renderLogger.trace('Workbench');

  const { importRepo, gitReady, loading } = useImportGit();
  const hasPreview = useStore(computed(workbenchStore.previews, (previews) => previews.length > 0));
  const files = useStore(workbenchStore.files);
  const showTerminal = useStore(workbenchStore.showTerminal);
  const setSelectedView = (view: WorkbenchViewType) => {
    workbenchStore.currentView.set(view);
  };

  useEffect(() => {
    if (gitReady && window.repoConfig?.url) {
      importRepo(window.repoConfig.url)
    }
  }, [gitReady]);

  useEffect(() => {
    if (hasPreview) {
      setSelectedView('preview');
    }
  }, [hasPreview]);

  useEffect(() => {
    async function startProject() {
      console.log("Start running commands");
      await workbenchStore.runShellCommand(`cd`, [window.repoConfig.rootDir]);
      await workbenchStore.runShellCommand(window.repoConfig.packageManager, ['install']);
      await workbenchStore.runShellCommand(window.repoConfig.serveCommand);
    }

    if (!loading) {
      startProject();
    }
  }, [loading]);

  return (
    <motion.div initial="open" variants={workbenchVariants} className="z-workbench">
      <div
        className={classNames(
          'fixed top-5 bottom-5 w-full z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier',
        )}
      >
        <div className="absolute inset-0 px-2 lg:px-4">
          <div className="h-full flex flex-col bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-sm rounded-lg overflow-hidden">
            <div className="relative flex-1 overflow-hidden">
              <PanelGroup direction="vertical">
                <Panel defaultSize={showTerminal ? DEFAULT_EDITOR_SIZE : 100} minSize={20}>
                  <PanelGroup direction="horizontal">
                    <Panel
                      defaultSize={20}
                      minSize={15}
                      collapsible
                      className="border-r border-bolt-elements-borderColor"
                    >
                      <div className="h-full">
                        {loading ? (
                          <div className="flex h-full items-center justify-center flex-col gap-5 text-sm text-bolt-elements-textSecondary">
                            <div className="i-ph:spinner-gap animate-spin w-8 h-8" />
                            Getting files...
                          </div>
                        ) : (
                          <FileTree className="h-full" files={files} hideRoot={false} rootFolder={WORK_DIR} />
                        )}
                      </div>
                    </Panel>

                    <PanelResizeHandle />
                    <Panel className="flex flex-col" defaultSize={80} minSize={20}>
                      <PanelHeader className="overflow-x-auto flex justify-end">
                        <div className="flex overflow-y-auto">
                          <PanelHeaderButton
                            className="mr-1 text-sm"
                            onClick={() => {
                              workbenchStore.toggleTerminal(!workbenchStore.showTerminal.get());
                            }}
                          >
                            <div className="i-ph:terminal" />
                            Toggle Terminal
                          </PanelHeaderButton>
                        </div>
                      </PanelHeader>
                      <div className="h-full flex-1 overflow-hidden modern-scrollbar">
                        <Preview setSelectedElement={(f) => f} />
                      </div>
                    </Panel>
                  </PanelGroup>
                </Panel>
                <PanelResizeHandle />
                <TerminalTabs />
              </PanelGroup>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
