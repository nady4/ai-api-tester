# 🤖 ai-api-tester

NPM package that generates comprehensive test suites for existing Node.js projects using AI.
Install it in **any existing project** and instantly generate intelligent tests for your routes and controllers.  
Simply run `npm install ai-api-tester` in your project and let AI analyze your code structure  
to create **production-ready test suites** with proper mocking, assertions, and edge cases.
Perfect for adding test coverage to **legacy projects** or accelerating development,  
where AI understands your codebase and generates contextual tests automatically.

<br>

## 🚀 Features

- **NPM Package**: Install directly in your existing Node.js projects as a dev dependency.
- **Smart Auto-Detection**: Automatically finds routes, controllers, and existing test setup.
- **Zero Configuration**: Works immediately after installation with intelligent defaults.
- **AI-Powered**: Uses OpenAI, Claude, or any compatible AI API for intelligent test generation.
- **Framework Agnostic**: Supports Jest, Mocha, Express, Next.js, NestJS, and more.
- **Project Integration**: Adds npm scripts and respects your existing project structure.

<br>

## ⚙️ Installation & Quick Start

### Install in Your Existing Project

```bash
# Navigate to your existing Node.js project
cd my-awesome-project

# Install as dev dependency
npm install --save-dev ai-api-tester

# Initialize (creates .env and adds npm scripts)
npx ai-api-tester --init

# Configure your AI API key in .env
# AI_API_URL=https://api.openai.com/v1
# AI_API_KEY=your-openai-key

# Generate tests!
npm run generate-tests
```

### Alternative: Use without installation

```bash
cd my-existing-project
npx ai-api-tester --init
npx ai-api-tester
```

<br>

## 📝 Usage

### Quick Usage (Zero Config)

```bash
# Auto-detects everything and generates tests
npm run generate-tests

# Or run directly
npx ai-api-tester

# Preview without creating files
npx ai-api-tester --dry-run
```

### Common Project Scenarios

```bash
# Express.js with standard structure
npx ai-api-tester --routes-dir "./routes" --controllers-dir "./controllers"

# Next.js API routes
npx ai-api-tester --routes-dir "./pages/api" --tests-dir "./__tests__/api"

# NestJS project
npx ai-api-tester --routes-dir "./src" --controllers-dir "./src"

# Custom structure with specific AI model
npx ai-api-tester --routes-dir "./api" --model "gpt-4o" --test-framework "mocha"
```

### Project Integration Features

```bash
# Initialize project (one-time setup)
npx ai-api-tester --init
# ✓ Creates .env with AI configuration
# ✓ Adds "generate-tests" script to package.json
# ✓ Auto-detects your project structure

# View what will be generated
npx ai-api-tester --dry-run --verbose

# Generate with custom settings
npx ai-api-tester --model "claude-3-sonnet" --test-framework "jest"
```

<br>

## 🔗 AI API Setup

**OpenAI Setup:**

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set environment variables:
   ```bash
   AI_API_URL=https://api.openai.com/v1
   AI_API_KEY=sk-your-openai-key
   ```

**Anthropic Claude Setup:**

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Set environment variables:
   ```bash
   AI_API_URL=https://api.anthropic.com/v1
   AI_API_KEY=sk-ant-your-claude-key
   ```

<br>

## 📝 Usage

### Quick Start (in any existing project)

```bash
# Navigate to your existing Node.js project
cd my-existing-project

# Generate tests with default settings
ai-api-tester

# Or use with custom AI provider
ai-api-tester --ai-url "https://api.anthropic.com/v1" --ai-key "your-claude-key"
```

### Common Use Cases

```bash
# Standard Express.js project
ai-api-tester --routes-dir "./routes" --controllers-dir "./controllers"

# Next.js API routes
ai-api-tester --routes-dir "./pages/api" --tests-dir "./__tests__/api"

# NestJS project structure
ai-api-tester --routes-dir "./src" --controllers-dir "./src" --tests-dir "./src/__tests__"

# Custom project structure
ai-api-tester --routes-dir "./api/routes" --controllers-dir "./api/controllers" --tests-dir "./test"

# Use different test framework
ai-api-tester --test-framework "mocha"
```

### Configuration Management

```bash
# View current configuration
ai-api-tester config --show

# Set global defaults
ai-api-tester config --ai-url "https://api.openai.com/v1" --ai-key "your-key" --model "gpt-4"

# Reset to defaults
ai-api-tester config --reset
```

### CLI Options

```bash
--ai-url, -u           AI API URL (required if not configured globally)
--ai-key, -k           AI API Key (required if not configured globally)
--model, -m            AI Model (default: "gpt-4")
--routes-dir, -r       Routes directory (default: auto-detect)
--controllers-dir, -c  Controllers directory (default: auto-detect)
--tests-dir, -t        Tests output directory (default: "./tests" or "./__tests__")
--test-framework, -f   Framework: jest|mocha (default: auto-detect from package.json)
--max-file-size, -s    Max file size in bytes (default: 50000)
--dry-run             Show what would be generated without creating files
--verbose, -v         Show detailed output
```

<br>

## 🧰 Tech Stack

💬 **Languages:**

- TypeScript
- Node.js

🛠 **Libraries/Frameworks:**

- Axios (HTTP client)
- Yargs (CLI parsing)
- Chalk (Terminal styling)
- fs-extra (File system utilities)
- dotenv (Environment variables)

🧪 **Testing Frameworks Supported:**

- Jest
- Mocha

🤖 **AI APIs Supported:**

- OpenAI (GPT-3.5, GPT-4, GPT-4o)
- Anthropic (Claude 3 Haiku, Sonnet, Opus)
- Any OpenAI-compatible API

<br>

## 📁 How It Works

```
Your Existing Project/
├── routes/              # Your existing route files
│   ├── users.js
│   └── products.js
├── controllers/         # Your existing controllers
│   ├── UserController.js
│   └── ProductController.js
├── package.json         # Existing dependencies
└── ...                  # Your other project files

# After running: ai-api-tester

Your Existing Project/
├── routes/
├── controllers/
├── tests/               # 🆕 Generated test directory
│   ├── routes/          # 🆕 Route tests
│   │   ├── users.test.js
│   │   └── products.test.js
│   └── controllers/     # 🆕 Controller tests
│       ├── UserController.test.js
│       └── ProductController.test.js
├── package.json
└── ...
```

<br>

## ⚡ Quick Setup

### First Time Setup (one-time)

```bash
# Install globally
npm install -g ai-api-tester

# Configure your AI API (choose one)
ai-api-tester config --ai-url "https://api.openai.com/v1" --ai-key "your-openai-key"
# OR
ai-api-tester config --ai-url "https://api.anthropic.com/v1" --ai-key "your-claude-key"
```

### Daily Usage (in any project)

```bash
# Navigate to any existing project
cd /path/to/your/project

# Generate tests
ai-api-tester

# That's it! ✨
```

<br>

## 🎯 Generated Test Features

- ✅ **HTTP Method Testing**: GET, POST, PUT, DELETE endpoint validation
- ✅ **Request/Response Testing**: Input validation and output verification
- ✅ **Error Handling**: Status codes, error messages, edge cases
- ✅ **Middleware Testing**: Authentication, authorization, validation layers
- ✅ **Mocking**: Database calls, external services, dependencies
- ✅ **Business Logic**: Controller method testing with comprehensive scenarios
- ✅ **Edge Cases**: Boundary conditions, null values, malformed inputs
- ✅ **Integration Ready**: Proper setup, teardown, and test organization
  <br>

## 👩‍💻 Contributing

Want to improve the tool? Contributions are welcome!

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Test with real projects:
   ```bash
   npm run build
   npm link  # Test globally
   cd /some/test/project
   ai-api-tester --dry-run
   ```
4. Commit your changes:
   ```bash
   git commit -m "Add amazing feature"
   ```
5. Push to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
6. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/ai-api-tester.git
cd ai-api-tester
npm install
npm run build
npm link  # Makes 'ai-api-tester' available globally for testing
```

<br>

## 🎯 Works with Existing Projects

### Supported Project Types

- **Express.js**: Classic MVC structure with routes and controllers
- **Next.js**: API routes in `/pages/api` or `/app/api`
- **NestJS**: Modular architecture with decorators and services
- **Fastify**: High-performance routes and handlers
- **Koa.js**: Middleware-based routing
- **Any Node.js**: Custom project structures with auto-detection

### Auto-Detection Features

- 🔍 **Smart Directory Detection**: Finds routes/controllers automatically
- 📦 **Package.json Integration**: Detects existing test framework preferences
- 🏗️ **Project Structure Analysis**: Adapts to your existing architecture
- 🧪 **Test Framework Detection**: Uses Jest/Mocha based on your dependencies
- 📁 **Output Location**: Respects existing test directory conventions

<br>

## 🚀 Examples

### Real Project Examples

```bash
# Example 1: Express.js e-commerce API
cd my-ecommerce-api
ai-api-tester
# ✅ Found: routes/products.js, routes/users.js, controllers/
# ✅ Generated: tests/routes/products.test.js, tests/controllers/ProductController.test.js

# Example 2: Next.js SaaS application
cd my-nextjs-saas
ai-api-tester --routes-dir "./pages/api"
# ✅ Found: pages/api/auth/login.js, pages/api/users/[id].js
# ✅ Generated: __tests__/api/auth/login.test.js

# Example 3: NestJS microservice
cd my-nest-service
ai-api-tester --routes-dir "./src" --controllers-dir "./src"
# ✅ Found: src/users/users.controller.ts, src/auth/auth.service.ts
# ✅ Generated: src/__tests__/users/users.controller.test.ts
```

### Generated Test Examples

```javascript
// Your existing route: routes/users.js
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Generated test: tests/routes/users.test.js
describe("Users API Routes", () => {
  test("GET /api/users/:id should return user data", async () => {
    const mockUser = { id: "123", name: "John Doe" };
    User.findById = jest.fn().mockResolvedValue(mockUser);

    const response = await request(app).get("/api/users/123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  test("GET /api/users/:id should handle user not found", async () => {
    User.findById = jest.fn().mockResolvedValue(null);

    const response = await request(app).get("/api/users/999");
    expect(response.status).toBe(404);
  });
});
```

<br>

## 📄 License

This project is open source under the [APACHE 2.0](LICENSE) license.
