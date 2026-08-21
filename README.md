# AI Workplace Assistant

Act as a principal software architect and UI/UX expert. Build a production-ready, fully functional prototype for a modern, responsive web application called "AI Workplace Productivity Assistant" designed for enterprise professionals, administrators, and teams.

### CORE ARCHITECTURE & UI LAYOUT

Build a clean, high-contrast, modern SaaS application featuring:

1. Left Sidebar Navigation: Responsive collapsable sidebar with active-state highlighting.

2. Top Navigation/Header: Persistent header displaying current page titles, user context, and a safe Demonstration/Fallback Mode toggle.

3. Main Content Area: Responsive container supporting cards, structured forms, and AI outputs.

4. Navigation Items:

   - Dashboard

   - Smart Email Generator

   - Meeting Notes Summarizer

   - AI Task Planner

   - AI Research Assistant

   - AI Workplace Chatbot

   - About / Responsible AI

### DASHBOARD PAGE

- Header with a professional welcome banner and concise application overview.

- 5 Feature Cards linking directly to each tool.

- Quick Action Buttons, a Recent Activity log, and a Workplace Productivity Tips widget.

### FEATURE SPECIFICATIONS & STRUCTURED SYSTEM PROMPTS

Implement reusable components, loading indicators, error handling, copy-to-clipboard buttons, regenerate actions, and state resets across all features. Enforce strict structured prompt engineering logic under the hood for each feature:

1. Smart Email Generator

   - Inputs: Audience dropdown (Client, Manager, Team, Colleague, Other), Tone dropdown (Formal, Professional, Friendly, Persuasive), Purpose, Context, Desired Outcome.

   - System Prompt Logic: 

     - Role: Workplace Communication Assistant.

     - Task: Generate a professional email using ONLY user-provided information.

     - Constraints: Do not invent facts/context. Match requested tone. Make action steps explicit.

     - Format: Return strictly formatted "Subject:" and "Email Body:".

2. Meeting Notes Summarizer

   - Inputs: Large text area for raw meeting transcripts/notes.

   - System Prompt Logic:

     - Role: Meeting Documentation Specialist.

     - Task: Extract key insights into a concise summary.

     - Constraints: Rely strictly on provided text. Do not invent decisions, deadlines, or assignees. Distinguish between confirmed actions and suggestions.

     - Format: Output structured sections: Meeting Summary, Key Discussion Points, Decisions Made, Action Items, Responsible People, and Deadlines.

3. AI Task Planner

   - Inputs: Multi-task entry interface (Task Name, Description, Deadline, Priority).

   - System Prompt Logic:

     - Role: Workplace Productivity Specialist.

     - Task: Prioritize inputs into an Eisenhower-style matrix and construct a realistic schedule.

     - Constraints: Do not hallucinate dates. Provide explicit reasoning for order. Account for realistic workload limits.

     - Format: Priority Category, Reasoning, Recommended Order, Suggested Daily Schedule.

4. AI Research Assistant

   - Inputs: Topic/Question text field, Depth selector (Simple, Intermediate, Detailed).

   - System Prompt Logic:

     - Role: Research Analyst.

     - Task: Synthesize the input topic into clear, actionable summaries.

     - Constraints: Separate established facts from assumptions. Highlight uncertainties requiring verification.

     - Format: Overview, Key Insights, Important Points, Recommendations, Questions for Further Research.

5. AI Workplace Chatbot

   - Inputs: Interactive chat feed with session memory and quick-prompt chips (e.g., "Help me prepare for a meeting", "Write a email to my manager").

   - System Prompt Logic:

     - Role: AI Workplace Productivity Assistant.

     - Constraints: Concise, professional tone. Prompt user for clarification when context is missing. Include reminders for human verification on critical tasks.

### RESPONSIBLE AI & SAFETY

- Display a prominent global disclaimer: "AI-generated content may require human review."

- Place inline reminders under generated outputs: "Please review and verify this AI-generated content before use."

- Create a dedicated "About / Responsible AI" page detailing: Project Overview, Core Problem/Solution, Prompt Engineering Architecture (Role, Task, Constraints, Format), Technical Architecture Stack, and Safety Protocols (disclaimers on bias, hallucinations, and privacy/confidentiality).

### FALLBACK DEMO MODE

- Include built-in, realistic mock data generation when external AI services fail or are offline.

- Explicitly tag simulated outputs with a badge: "Demo Output – AI Service Unavailable" to maintain transparency.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://team-brightspark.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cef6244d-b812-410a-a91f-bbd10b068e85).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
