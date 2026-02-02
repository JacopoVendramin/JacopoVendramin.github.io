class TerminalPortfolio {
  constructor() {
    this.input = document.getElementById("terminal-input");
    this.terminal = document.getElementById("terminal");
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentTheme = 0;
    this.themes = ["default", "matrix", "cyberpunk", "retro"];

    this.commands = {
      help: this.helpCommand.bind(this),
      clear: this.clearCommand.bind(this),
      about: this.aboutCommand.bind(this),
      skills: this.skillsCommand.bind(this),
      experience: this.experienceCommand.bind(this),
      contact: this.contactCommand.bind(this),
      ls: this.lsCommand.bind(this),
      cat: this.catCommand.bind(this),
      whoami: this.whoamiCommand.bind(this),
      theme: this.themeCommand.bind(this),
      readme: this.readmeCommand.bind(this),
      sudo: this.sudoCommand.bind(this),
      hack: this.hackCommand.bind(this),
      matrix: this.matrixCommand.bind(this),
      coffee: this.coffeeCommand.bind(this),
    };

    this.fileSystem = {
      "about.txt": "about",
      "skills.txt": "skills",
      "experience.txt": "experience",
      "contact.txt": "contact",
      "README.md": "readme",
    };

    this.init();
  }

  init() {
    this.input.addEventListener("keydown", (e) => this.handleInput(e));
    this.input.addEventListener("input", () => this.updateCursor());
    document
      .getElementById("theme-btn")
      .addEventListener("click", () => this.cycleTheme());
    this.input.focus();

    document.addEventListener("click", () => {
      this.input.focus();
    });

    this.updateCursor();
    
    // Display readme on startup
    this.displayInitialReadme();
  }

  displayInitialReadme() {
    const readme = `
<div class="project-card">
<span class="project-title">📖 Jacopo Vendramin's Interactive Portfolio</span><br><br>

Welcome to my terminal-based portfolio! This isn't just a website—it's an experience.<br><br>

<span class="highlight">Quick Start:</span><br>
  • Type <span class="command">help</span> to see all commands<br>
  • Use <span class="command">Tab</span> for autocomplete<br>
  • Use <span class="command">↑/↓</span> arrows for command history<br>
  • Try hidden commands (hint: try tech-related words!)<br><br>

<span class="highlight">Features:</span><br>
  • ✨ Interactive command-line interface<br>
  • 🎨 Multiple color themes<br>
  • ⚡ Real-time command execution<br>
  • 🎯 Easter eggs and hidden commands<br><br>

<span class="highlight">About This Site:</span><br>
Built with vanilla JavaScript—no frameworks, just pure code.<br>
Because sometimes the best tool is knowing when you don't need one.<br><br>

<span class="success">Enjoy exploring! 🚀</span>
</div>
`;
    const readmeContainer = document.getElementById("initial-readme");
    readmeContainer.innerHTML = readme;
    readmeContainer.className = "output-line";
  }

  updateCursor() {
    const cursor = this.input.parentElement.querySelector(".cursor");
    if (cursor) {
      const prompt = this.input.parentElement.querySelector(".prompt");
      const promptWidth = prompt ? prompt.offsetWidth : 0;
      
      // Create a temporary span to measure text width
      const measureSpan = document.createElement("span");
      measureSpan.style.visibility = "hidden";
      measureSpan.style.position = "absolute";
      measureSpan.style.font = window.getComputedStyle(this.input).font;
      measureSpan.textContent = this.input.value;
      document.body.appendChild(measureSpan);
      const textWidth = measureSpan.offsetWidth;
      document.body.removeChild(measureSpan);
      
      cursor.style.left = `${promptWidth + textWidth + 8}px`;
    }
  }

  handleInput(e) {
    if (e.key === "Enter") {
      const command = this.input.value.trim();
      if (command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        this.executeCommand(command);
      } else {
        this.addPromptLine();
      }
      this.input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.commandHistory[this.historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.input.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      this.autocomplete();
    }
  }

  executeCommand(input) {
    this.addOutput(`<span class="prompt">visitor@jacopo:~$</span> ${input}`);

    const [cmd, ...args] = input.split(" ");
    const command = cmd.toLowerCase();

    if (this.commands[command]) {
      this.commands[command](args);
    } else {
      this.addOutput(
        `Command not found: ${command}. Type '<span class="highlight">help</span>' for available commands.`,
        "error",
      );
    }

    this.addPromptLine();
    this.scrollToBottom();
  }

  autocomplete() {
    const input = this.input.value.toLowerCase();
    if (!input) return;

    const matches = Object.keys(this.commands).filter((cmd) =>
      cmd.startsWith(input),
    );

    if (matches.length === 1) {
      this.input.value = matches[0];
    } else if (matches.length > 1) {
      this.addOutput(
        `<span class="prompt">visitor@jacopo:~$</span> ${this.input.value}`,
      );
      this.addOutput(matches.join("  "));
      this.addPromptLine();
    }
  }

  addOutput(text, className = "") {
    const line = document.createElement("div");
    line.className = `output-line ${className}`;
    line.innerHTML = text;

    const inputLine = this.terminal.querySelector(".input-line");
    this.terminal.insertBefore(line, inputLine);
  }

  addPromptLine() {
    const inputLine = this.terminal.querySelector(".input-line");
    const newPrompt = inputLine.cloneNode(true);
    newPrompt.querySelector(".terminal-input").value = "";

    this.terminal.removeChild(inputLine);
    this.terminal.appendChild(newPrompt);

    this.input = newPrompt.querySelector(".terminal-input");
    this.input.addEventListener("keydown", (e) => this.handleInput(e));
    this.input.addEventListener("input", () => this.updateCursor());
    this.input.focus();
    this.updateCursor();
  }

  scrollToBottom() {
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  // Commands
  helpCommand() {
    const help = `
<div class="project-card">
<span class="project-title">Available commands:</span><br><br>
  • <span class="command">help</span> - Show this help message<br>
  • <span class="command">about</span> - Learn about me<br>
  • <span class="command">skills</span> - View my technical skills<br>
  • <span class="command">experience</span> - My work experience<br>
  • <span class="command">contact</span> - Get in touch<br>
  • <span class="command">ls</span> - List files<br>
  • <span class="command">cat [file]</span> - Read a file<br>
  • <span class="command">whoami</span> - Display current user<br>
  • <span class="command">theme</span> - Change color theme<br>
  • <span class="command">clear</span> - Clear terminal<br><br>
<span class="highlight">Try some hidden commands! Type random things and see what happens... 🕵️</span>
</div>
        `;
    this.addOutput(help);
  }

  clearCommand() {
    const outputs = this.terminal.querySelectorAll(".output-line");
    outputs.forEach((output) => output.remove());
  }

  aboutCommand() {
    const about = `
<div class="project-card">
<span class="project-title">👋 About Me</span>

Hey! I'm <span class="highlight">Jacopo Vendramin</span>, a pragmatic software engineer who loves building 
scalable, cloud-native systems that actually work.

I don't box myself into "frontend" or "backend"—I'm a <span class="highlight">Software Engineer</span>, 
applying engineering principles across the entire stack. From requirement analysis and system 
design to implementation and maintenance, I thrive in all phases of the development lifecycle.

<span class="accent-secondary">🛠️ What I work with:</span>
  • Cloud platforms (AWS), Node.js, Python
  • API design and automation workflows
  • DevOps culture and agile collaboration

<span class="accent-secondary">💡 My philosophy:</span>
Technology is a tool, not an end. Code is like language—important, but what really matters 
is <span class="highlight">having something meaningful to say</span>. I focus on understanding what truly 
matters and designing solutions that deliver real value.

Clean code, practical solutions, and building things that users actually need—that's what drives me.
</div>
        `;
    this.addOutput(about);
  }

  skillsCommand() {
    const skills = `
<div class="project-card">
<span class="project-title">⚡ Technical Skills</span><br>
<span style="font-size: 12px; color: var(--text-secondary);">(or: things I've googled enough times to be dangerous)</span><br><br>

<span class="highlight">Languages I can read without crying:</span><br>
• JavaScript/TypeScript - My daily driver (still looking up array methods)<br>
• Python - When I need to automate my laziness<br>
• Go - Fast code, slow learning curve<br>
• Rust - The compiler is my therapist<br>
• C++ - For when I need embedded nightmares<br><br>

<span class="highlight">Frontend (aka making rectangles look pretty):</span><br>
• React, Vue, Svelte - Pick your poison<br>
• Nuxt - SSR without the tears<br>
• CSS - Still centering divs in 2026<br><br>

<span class="highlight">Backend (aka the fun stuff):</span><br>
• Node.js, Deno, Bun - Because one runtime isn't enough<br>
• NestJS, Express, Strapi - API factories<br>
• REST, GraphQL - Arguing about which is better<br><br>

<span class="highlight">Cloud & DevOps (aka someone else's computer):</span><br>
• AWS, GCP, Azure - Choose your cloud overlord<br>
• Docker, Kubernetes - Container inception<br>
• CI/CD - Breaking production faster<br><br>

<span class="highlight">Databases (data hoarder edition):</span><br>
• PostgreSQL, MongoDB - SQL or NoSQL? Yes.<br>
• Redis - When you need SPEED<br><br>

<span class="accent-secondary">💡 Real talk:</span> I believe in learning what's needed for the job, not collecting<br>
tech stack Pokemon. Every tool has its place, and ego has none.
</div>
        `;
    this.addOutput(skills);
  }

  experienceCommand() {
    const experience = `
<div class="project-card">
<span class="project-title">💼 Work Experience</span><br><br>

<span class="highlight">Back End Developer</span> @ Crispy Bacon | Digital Company<br>
<span class="project-tech">February 2024 - Present</span><br><br>

<span class="highlight">Software Developer</span> @ VMA INNOVA<br>
<span class="project-tech">January 2018 - Present</span><br>
• Python automation: scripts for text file management and processing<br>
• Embedded development: Arduino and bare-metal C++ projects<br>
• Focus on performance, efficiency, and direct hardware control<br><br>

<span class="highlight">Co-Founder | Full Stack Engineer</span> @ MAINDOLAB Srl<br>
<span class="project-tech">January 2021 - February 2024</span><br>
• Requirements gathering and presales with clients and stakeholders<br>
• Full-stack development: Vue.js, Nuxt, Strapi, NestJS, Express<br>
• Deployment and infrastructure: on-premises and cloud with Docker<br><br>

<span class="highlight">Full Stack Engineer</span> @ WSB Srl<br>
<span class="project-tech">September 2020 - January 2021</span><br><br>

<span class="highlight">Frontend Developer</span> @ Athesys Srl<br>
<span class="project-tech">September 2019 - August 2020</span><br><br>

<span class="highlight">Web Developer Internship</span> @ Develon Digital<br>
<span class="project-tech">June 2018 - September 2018</span><br>
</div>

<div class="project-card">
<span class="project-title">🏆 Honors & Awards</span><br><br>

<span class="highlight">IBM University Team Challenge</span> - IBM Prize Winner<br>
<span class="project-tech">November 2018 | University of Birmingham</span><br>
Won IBM prize (out of 25 teams) for creating a Bomberman-inspired game.<br>
Developed main menu, sound component, and achievements system.<br><br>

<span class="highlight">IT Innovation Challenge</span> - Birmingham-Dubai Digital Wall<br>
<span class="project-tech">November 2018 | University of Birmingham</span><br>
Designed interactive stories-based cross-platform application using UML.<br>
Project selected for development by the University IT Innovation Centre.<br><br>

<span class="highlight">Hackference 2017</span> - 1st Microsoft Prize<br>
<span class="project-tech">October 2017 | Microsoft</span><br>
"Sirio Home Bot" - Best implementation of Microsoft Bot Framework and Cognitive Services.<br><br>

<span class="highlight">Hackference 2016</span> - 1st Microsoft Prize<br>
<span class="project-tech">October 2016 | Microsoft</span><br>
Autonomous RC car using Microsoft Cognitive Vision API with collision detection<br>
and vision recognition capabilities.<br>
</div>
        `;
    this.addOutput(experience);
  }

  contactCommand() {
    const contact = `
<div class="project-card">
<span class="project-title">📬 Get In Touch</span><br><br>

  • <span class="highlight">GitHub:</span> <a href="https://github.com/JacopoVendramin" target="_blank" class="link">github.com/JacopoVendramin</a><br>
  • <span class="highlight">Email:</span> <a href="mailto:vendraminjacopo@gmail.com" class="link">vendraminjacopo@gmail.com</a><br>
  • <span class="highlight">LinkedIn:</span> <a href="https://www.linkedin.com/in/vendraminjacopo/" target="_blank" class="link">linkedin.com/in/vendraminjacopo</a><br><br>

<span class="success">💬 Always open to interesting projects and collaborations!</span>
</div>
        `;
    this.addOutput(contact);
  }

  lsCommand() {
    const files = Object.keys(this.fileSystem)
      .map((file) => `<span class="file-item">${file}</span>`)
      .join("  ");

    this.addOutput('<div class="file-list">');
    this.addOutput(files);
    this.addOutput("</div>");
    this.addOutput(`\nTotal: ${Object.keys(this.fileSystem).length} files`);
  }

  catCommand(args) {
    if (args.length === 0) {
      this.addOutput("Usage: cat [filename]", "error");
      this.addOutput("Try: cat README.md");
      return;
    }

    const filename = args[0];
    if (this.fileSystem[filename]) {
      const command = this.fileSystem[filename];
      if (this.commands[command]) {
        this.commands[command]([]);
      }
    } else {
      this.addOutput(`cat: ${filename}: No such file or directory`, "error");
    }
  }

  whoamiCommand() {
    this.addOutput("visitor");
    this.addOutput("");
    this.addOutput(
      "But you're exploring <span class=\"highlight\">Jacopo Vendramin's</span> portfolio!",
    );
  }

  themeCommand() {
    this.cycleTheme();
    this.addOutput(
      `Theme changed to: <span class="highlight">${this.themes[this.currentTheme]}</span>`,
      "success",
    );
  }

  cycleTheme() {
    this.currentTheme = (this.currentTheme + 1) % this.themes.length;
    document.body.className =
      this.themes[this.currentTheme] === "default"
        ? ""
        : `theme-${this.themes[this.currentTheme]}`;
  }

  // Easter eggs
  sudoCommand(args) {
    const responses = [
      "Nice try! But you're not in the sudoers file. This incident will be reported. 😏",
      "sudo: You have been logged. The authorities have been notified.",
      "With great power comes great responsibility... which you don't have here. 🦸",
    ];
    this.addOutput(
      responses[Math.floor(Math.random() * responses.length)],
      "warning",
    );
  }

  hackCommand() {
    this.addOutput(
      '<span class="success">Initializing hack sequence...</span>',
    );
    this.addOutput("Bypassing firewall... ███████████ 100%");
    this.addOutput("Decrypting mainframe... ███████████ 100%");
    this.addOutput("Accessing root directory... ███████████ 100%");
    this.addOutput("");
    this.addOutput(
      '<span class="error">Just kidding! 😄 Nice try though.</span>',
    );
    this.addOutput(
      'Want to close the terminal? Try <span class="highlight">Ctrl+W</span>... 😉',
    );
  }

  matrixCommand() {
    this.addOutput('<span class="success">Entering the Matrix...</span>');
    this.addOutput("");
    this.addOutput('<span class="highlight">Red pill or blue pill?</span>');
    this.addOutput(
      'Actually, just use the <span class="command">theme</span> command for Matrix mode! 🕶️',
    );
  }

  coffeeCommand() {
    const art = `
           )  (
          (   ) )
           ) ( (
         _______)_
      .-'---------|  
     ( C|/\\/\\/\\/\\/|
      '-./\\/\\/\\/\\/|
        '_________'
           '----'
        `;
    this.addOutput("<pre>" + art + "</pre>");
    this.addOutput(
      '<span class="success">☕ Behold! The potion of eternityyyyyyy...</span>',
    );
    this.addOutput("");
    this.addOutput(
      '<span class="error">Oh no, wait... it\'s just coffee. ☕</span>',
    );
  }

  readmeCommand() {
    const readme = `
<div class="project-card">
<span class="project-title">📖 Jacopo Vendramin's Interactive Portfolio</span><br><br>

Welcome to my terminal-based portfolio! This isn't just a website—it's an experience.<br><br>

<span class="highlight">Quick Start:</span><br>
  • Type <span class="command">help</span> to see all commands<br>
  • Use <span class="command">Tab</span> for autocomplete<br>
  • Use <span class="command">↑/↓</span> arrows for command history<br>
  • Try hidden commands (hint: try tech-related words!)<br><br>

<span class="highlight">Features:</span><br>
  • ✨ Interactive command-line interface<br>
  • 🎨 Multiple color themes<br>
  • ⚡ Real-time command execution<br>
  • 🎯 Easter eggs and hidden commands<br><br>

<span class="highlight">About This Site:</span><br>
Built with vanilla JavaScript—no frameworks, just pure code.<br>
Because sometimes the best tool is knowing when you don't need one.<br><br>

<span class="success">Enjoy exploring! 🚀</span>
</div>
        `;
    this.addOutput(readme);
  }
}

// Initialize terminal
const terminal = new TerminalPortfolio();
