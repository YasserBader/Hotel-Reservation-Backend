const fs = require('fs');
const path = require('path');

// Specify the project directory to scan
const projectDir = './src'; // Change this to your project folder
const outputFile = './project_documentation.md'; // Output file
const ignoreFolders = ['node_modules']; // Add folders to exclude here
const ignoreFiles = [path.basename(__filename), outputFile]; // Exclude this script and output file

// Function to create a directory tree structure
const createDirectoryTree = (dir, prefix = '') => {
  const files = fs.readdirSync(dir);
  let tree = '';
  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const isLast = index === files.length - 1;
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (ignoreFolders.includes(path.basename(filePath))) return;

    tree += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;

    if (isDirectory) {
      tree += createDirectoryTree(filePath, prefix + (isLast ? '    ' : '│   '));
    }
  });
  return tree;
};

// Function to recursively read files in a directory
const readFilesRecursively = (dir, result = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileName = path.basename(filePath);

    // Ignore specified folders and files
    if (ignoreFolders.includes(fileName) || ignoreFiles.includes(fileName)) return;

    if (fs.statSync(filePath).isDirectory()) {
      readFilesRecursively(filePath, result);
    } else {
      result.push(filePath);
    }
  });
  return result;
};

// Generate documentation
const generateDocumentation = () => {
  const files = readFilesRecursively(projectDir);

  // Build the documentation content
  let documentation = '# Project Documentation\n\n';

  // Add directory tree structure
  documentation += '## Directory Structure\n\n';
  documentation += '```\n';
  documentation += `${createDirectoryTree(projectDir)}\n`;
  documentation += '```\n\n';

  // Add file contents
  files.forEach((file) => {
    const relativePath = path.relative('.', file);
    const content = fs.readFileSync(file, 'utf-8');
    documentation += `## File: ${relativePath}\n\`\`\`\n${content}\n\`\`\`\n\n---\n\n`;
  });

  // Write to the output file
  fs.writeFileSync(outputFile, documentation);
  console.log(`Documentation written to ${outputFile}`);
};

// Run the script
generateDocumentation();
