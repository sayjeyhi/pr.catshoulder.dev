import { useGit } from '~/lib/hooks/useGit';
import { useState } from 'react';
import ignore from 'ignore';
import { createCommandsMessage, detectProjectCommands, escapeBoltTags } from '~/utils/projectCommands';
import { generateId, type Message } from 'ai';
import { toast } from 'react-toastify';

const IGNORE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  '.github/**',
  '.vscode/**',
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.png',
  'dist/**',
  'build/**',
  '.next/**',
  'coverage/**',
  '.cache/**',
  '.vscode/**',
  '.idea/**',
  '**/*.log',
  '**/.DS_Store',
  '**/npm-debug.log*',
  '**/yarn-debug.log*',
  '**/yarn-error.log*',

  // Include this so npm install runs much faster '**/*lock.json',
  '**/*lock.yaml',
];

export function useImportGit() {
  const { ready: gitReady, gitClone } = useGit();
  const [loading, setLoading] = useState(true);

  const importRepo = async (repoUrl?: string) => {
    if (!gitReady) {
      alert('Git is not ready yet');
      return;
    }

    if (repoUrl) {
      const ig = ignore().add(IGNORE_PATTERNS);

      try {
        const { workdir, data } = await gitClone(repoUrl);

        const filePaths = Object.keys(data).filter((filePath) => !ig.ignores(filePath));
        const textDecoder = new TextDecoder('utf-8');

        const fileContents = filePaths
          .map((filePath) => {
            const { data: content, encoding } = data[filePath];
            return {
              path: filePath,
              content: encoding === 'utf8' ? content : content instanceof Uint8Array ? textDecoder.decode(content) : '',
            };
          })
          .filter((f) => f.content);

        const commands = await detectProjectCommands(fileContents);
        const commandsMessage = createCommandsMessage(commands);

        console.log(commandsMessage)

        setLoading(false);
      } catch (error) {
        console.error('Error during import:', error);
        toast.error('Failed to import repository');
        setLoading(false);
      }
    }
  };

  return { importRepo, loading, gitReady };
}
