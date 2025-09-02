# 🦄 ai-api-tester

Global CLI tool that intelligently generates comprehensive test suites for existing Node.js projects using AI.
This is a **global npm package** that you can install once and use across **all your Node.js projects**.  
Simply run `ai-api-tester` in any project directory and it will **scan your routes and controllers**,  
analyze your code structure, and generate **intelligent, comprehensive tests** using AI.
Perfect for adding test coverage to **existing projects** without writing tests manually,  
where AI understands your codebase context and generates production-ready test suites.
<br><br>

## 🚀 Features

- **Global CLI**: Install once, use in any Node.js project directory.
- **Zero Configuration**: Works out of the box with sensible defaults for existing projects.
- **Smart Detection**: Automatically finds routes and controllers in common project structures.
- **AI-Powered**: Generates comprehensive tests using OpenAI, Claude, or any compatible AI API.
- **Framework Support**: Jest and Mocha with proper mocking and assertions.
- **Project Aware**: Respects your existing project structure and dependencies.
  <br><br>

## ⚙️ Installation

### Global Installation (Recommended)

```bash
npm install -g ai-api-tester
```

### Or use with npx (no installation required)

```bash
npx ai-api-tester --help
```

### Configure your AI API

Create a global config or use environment variables:

```bash
# Set globally (one time setup)
ai-api-tester config --ai-url "https://api.openai.com/v1" --ai-key "your-key"

# Or use environment variables
export AI_API_URL="https://api.openai.com/v1"
export AI_API_KEY="your_openai_api_key"
```

<br><br>

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
   <br><br>

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

<br>

### Configuration Management

```bash
# View current configuration
ai-api-tester config --show

# Set global defaults
ai-api-tester config --ai-url "https://api.openai.com/v1" --ai-key "your-key" --model "gpt-4"

# Reset to defaults
ai-api-tester config --reset
```

<br>

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

<br><br>

## ⚡ Quick Setup
### First Time Setup (one-time)
```bash
# Install globally
npm install -g ai-api-tester

<br><br>

# Configure your AI API (choose one)

ai-api-tester config --ai-url "https://api.openai.com/v1" --ai-key "your-openai-key"

### OR

ai-api-tester config --ai-url "https://api.anthropic.com/v1" --ai-key "your-claude-key"

````

### Daily Usage (in any project)
```bash
# Navigate to any existing project
cd /path/to/your/project

# Generate tests
ai-api-tester

# That's it! ✨
````

<br><br>

## 🎯 Generated Test Features

- ✅ **HTTP Method Testing**: GET, POST, PUT, DELETE endpoint validation
- ✅ **Request/Response Testing**: Input validation and output verification
- ✅ **Error Handling**: Status codes, error messages, edge cases
- ✅ **Middleware Testing**: Authentication, authorization, validation layers
- ✅ **Mocking**: Database calls, external services, dependencies
- ✅ **Business Logic**: Controller method testing with comprehensive scenarios
- ✅ **Edge Cases**: Boundary conditions, null values, malformed inputs
- ✅ **Integration Ready**: Proper setup, teardown, and test organization

<br><br>

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

<br><br>

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

<br><br>

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

<br>

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

<br><br>

## 📄 License

This project is open source under the [APACHE 2.0](LICENSE) license.
