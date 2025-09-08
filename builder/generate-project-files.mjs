import fs from 'fs';
import path from 'path';


const baseIgnorePath = ['.git']
const gitIgnorePath = fs.readFileSync(path.join(process.cwd(), '.gitignore'), 'utf8').split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));

const IGNORE_PATTERNS = [...baseIgnorePath, ...gitIgnorePath];

function shouldIgnore(filePath) {
  const relativePath = path.relative('.', filePath);
  return IGNORE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(relativePath);
    }
    return relativePath.startsWith(pattern) || relativePath.includes('/' + pattern);
  });
}

function isTextFile(filePath) {
  const textExtensions = [
    '.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.scss', '.sass',
    '.yml', '.yaml', '.xml', '.svg', '.env', '.gitignore',
    '.py', '.java', '.cpp', '.c', '.h', '.php', '.rb', '.go', '.rs',
    '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
    '.dockerfile', '.dockerignore', '.editorconfig', '.eslintrc',
    '.prettierrc', '.babelrc', '.webpack.config.js', '.rollup.config.js'
  ];

  const ext = path.extname(filePath).toLowerCase();
  if (textExtensions.includes(ext)) return true;

  // Check for files without extensions that are typically text
  const basename = path.basename(filePath).toLowerCase();
  const textFiles = [
    'license', 'contributing', 'dockerfile',
    'makefile', 'rakefile', 'gemfile', 'procfile', 'requirements.txt'
  ];

  return textFiles.some(name => basename.startsWith(name));
}

function readDirectoryRecursive(dirPath, basePath = '') {
  const result = {};

  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relativePath = path.join(basePath, item.name);

      if (shouldIgnore(fullPath)) {
        console.log(`Ignoring: ${relativePath}`);
        continue;
      }

      if (item.isDirectory()) {
        const subdirectory = readDirectoryRecursive(fullPath, relativePath);
        if (Object.keys(subdirectory).length > 0) {
          result[item.name] = {
            directory: subdirectory
          };
        }
      } else if (item.isFile()) {
        try {
          if (isTextFile(fullPath)) {
            const stats = fs.statSync(fullPath);
            // Skip very large files (>1MB)
            if (stats.size > 1024 * 1024) {
              console.log(`Skipping large file: ${relativePath} (${Math.round(stats.size / 1024)}KB)`);
              result[item.name] = {
                file: {
                  contents: `// File too large to display (${Math.round(stats.size / 1024)}KB)\n// Path: ${relativePath}`
                }
              };
              continue;
            }

            const contents = fs.readFileSync(fullPath, 'utf8');
            result[item.name] = {
              file: {
                contents: contents
              }
            };
            console.log(`Added file: ${relativePath} (${contents.length} chars)`);
          } else {
            // For binary files, add a placeholder
            result[item.name] = {
              file: {
                contents: `// Binary file: ${relativePath}\n// This file cannot be displayed in WebContainer`
              }
            };
            console.log(`Added binary file placeholder: ${relativePath}`);
          }
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error.message);
          result[item.name] = {
            file: {
              contents: `// Error reading file: ${error.message}`
            }
          };
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }

  return result;
}

console.log('Generating project files structure...');
const projectStructure = readDirectoryRecursive('.');

// Get repository name for the project key
const repoName = process.env.GITHUB_REPOSITORY ?
  process.env.GITHUB_REPOSITORY.split('/')[1] : 'myProject';

const projectFiles = {
  [repoName]: {
    directory: projectStructure
  }
};

// Write to file
const outputPath = 'builder/projectFiles.json';
const jsonContent = JSON.stringify(projectFiles, null, 2);

fs.writeFileSync(outputPath, jsonContent, 'utf8');

// Also create a JavaScript module version
const jsContent = `export const projectFiles = ${jsonContent};`;
fs.writeFileSync('builder/projectFiles.js', jsContent, 'utf8');

console.log(`Generated project files structure with ${Object.keys(projectStructure).length} top-level items`);
console.log(`Output written to: ${outputPath}`);
console.log(`Size: ${Math.round(jsonContent.length / 1024)}KB`);
