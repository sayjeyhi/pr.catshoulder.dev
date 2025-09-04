import core from "@actions/core";
import github from "@actions/github";

async function run() {
  try {
    // Read inputs from GitHub Actions
    const prCommentMessage = "WebContainer Terminal Output:";

    // Get the GitHub context
    const context = github.context;
    
    if (context.eventName !== 'pull_request') {
      core.info("This action only works on pull request events.");
      core.setOutput("status", "skipped");
      return;
    }

    // Initialize GitHub API client
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

    // Create HTML content with embedded WebContainer
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>WebContainer Terminal</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f6f8fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: #24292e;
            color: white;
            padding: 15px 20px;
            font-weight: 600;
        }
        .terminal {
            background: #1e1e1e;
            color: #f8f8f2;
            padding: 20px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
            min-height: 200px;
            white-space: pre-wrap;
            overflow-x: auto;
        }
        .loading {
            color: #61dafb;
        }
        .error {
            color: #ff6b6b;
        }
        .success {
            color: #51cf66;
        }
        .command {
            color: #f8f8f2;
        }
        .output {
            color: #a8ff60;
        }
        .status {
            background: #f1f3f4;
            padding: 15px 20px;
            border-top: 1px solid #e1e4e8;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            🌐 WebContainer Terminal
        </div>
        <div class="terminal" id="terminal">
            <div class="loading">Loading WebContainer...</div>
        </div>
        <div class="status" id="status">
            Status: Initializing...
        </div>
    </div>

    <script type="module">
        import { WebContainer } from 'https://app.unpkg.com/@webcontainer/api@1.5.1/dist/index.js';
        
        const terminal = document.getElementById('terminal');
        const status = document.getElementById('status');
        
        async function runWebContainer() {
            try {
                status.textContent = 'Status: Booting WebContainer...';
                
                // Boot the WebContainer
                const webcontainer = await WebContainer.boot();
                
                status.textContent = 'Status: WebContainer ready, running command...';
                terminal.innerHTML = '<div class="command">$ echo "hello-world!"</div>';
                
                // Run the echo command
                const process = await webcontainer.spawn('echo', ['hello-world!']);
                
                // Wait for the process to complete
                const { code } = await process.exit;
                
                // Get the output
                const output = await process.output;
                
                // Display the output
                terminal.innerHTML += '<div class="output">' + output + '</div>';
                
                if (code === 0) {
                    status.innerHTML = '<span class="success">✅ Command executed successfully</span> | Exit Code: ' + code;
                } else {
                    status.innerHTML = '<span class="error">❌ Command failed</span> | Exit Code: ' + code;
                }
                
            } catch (error) {
                terminal.innerHTML += '<div class="error">Error: ' + error.message + '</div>';
                status.innerHTML = '<span class="error">❌ WebContainer failed to start</span>';
                console.error('WebContainer error:', error);
            }
        }
        
        // Start the WebContainer when the page loads
        runWebContainer();
    </script>
</body>
</html>
    `.trim();

    // Create the comment content with embedded HTML
    const commentBody = `
${prCommentMessage}

<details>
<summary>🌐 Click to open WebContainer Terminal</summary>

${htmlContent}

</details>

**Note:** This WebContainer runs in your browser using the [WebContainer API](https://webcontainers.io/).
    `.trim();

    // Post comment on the PR
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number,
      body: commentBody
    });

    core.info("Comment posted successfully on PR");
    core.setOutput("status", "success");

  } catch (error) {
    core.setFailed(`WebContainer action failed: ${error.message}`);
  }
}

run();
