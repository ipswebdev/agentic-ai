AI Engineer + Full-Stack AI Engineer Roadmap
Updated plan --- November 16, 2026
Target completion: February 28, 2027
Weekly commitment: 6--7 hours (plan around 6.5 hours)
Estimated remaining effort: 97.5 hours across 15 weeks
What is already complete
- W1 --- RAG baseline: completed. Keep the existing evaluation set
  and findings as the benchmark for later RAG improvements.
- W2 --- Persistent conversation threads: completed.
  Thread/message persistence, ownership checks, frontend integration,
  conversation selection and deletion have been implemented and
  tested.
Do not repeat these milestones unless later evaluation reveals a
specific gap.
Revised learning order
The next topics are deliberately ordered as:
1. LLM tool calling and function execution
2. MCP fundamentals and hands-on client/server integration
3. Google ADK agents, tools, state and workflows
4. LangGraph fundamentals and comparison
5. Conversational RAG
6. RAG quality improvements
7. Agentic RAG integration
This sequence separates the concepts. Tool calling teaches the
underlying model/tool interaction; MCP standardizes how tools are
exposed and consumed; ADK then provides an agent framework in which
tools and workflows can be orchestrated.

The existing RAG baseline remains intact. We are postponing
conversational RAG and RAG quality work, not abandoning RAG
fundamentals.
Phase 1 --- Tool calling and MCP
Week 1 · November 16--22
Focus: LLM tool calling fundamentals

Goal: Understand and implement the complete tool-calling loop
without introducing an agent framework yet.

Activities: - Distinguish a normal LLM response, structured output and
tool calling. - Understand tool/function schemas, descriptions,
arguments and validation. - Learn the model-request → tool-call decision
→ application execution → tool-result → model-follow-up cycle. -
Implement one controlled document-related tool in Python. - Validate
arguments in application code; never trust model-generated arguments. -
Handle unknown tools, invalid inputs, execution errors and timeouts. -
Test both successful and failed tool calls.

Deliverable: A working Python tool-calling flow that invokes a
controlled document operation and uses the result in a final answer.
Week 2 · November 23--29
Focus: MCP architecture and fundamentals

Goal: Understand MCP independently of ADK or LangGraph.

Activities: - Understand the MCP host, client and server roles. - Learn
tools, resources and prompts, including what each is for. - Understand
the lifecycle: initialization, capability discovery and invocation. -
Compare MCP with REST APIs and native LLM function calling. - Explore
the protocol's message model and supported transports at a practical
level. - Run an existing MCP server and inspect its capabilities. - Use
an MCP client to list and call a tool.

Deliverable: A small working MCP client that connects to a server,
discovers tools and invokes one successfully.
Week 3 · November 30--December 6
Focus: Build and integrate an MCP server

Goal: Expose a useful, permission-aware operation from the existing
project through MCP.

Activities: - Build a small Python MCP server around a document
operation, such as document metadata lookup or controlled document
search. - Define clear input and output schemas. - Validate inputs and
return useful errors. - Connect to the server using an MCP client. -
Test tool discovery and invocation. - Handle unavailable servers,
timeouts and malformed responses. - Keep authentication, ownership and
authorization checks in application code---not in the model's
decision. - Document the boundary between the MCP server and the
existing Express/FastAPI services.

Deliverable: A working MCP server and client demonstrating a useful
document operation, with validation and permission boundaries.
Phase 2 --- Google ADK and orchestration
Week 4 · December 7--13
Focus: Google ADK fundamentals and tool-using agents

Goal: Build an agent and understand how ADK structures model-driven
tool use.

Activities: - Understand ADK's core abstractions: agents, instructions,
models, tools, runners and sessions. - Compare a direct tool-calling
loop with an ADK agent. - Create a basic Python ADK agent. - Add one
controlled document-related tool. - Add the MCP integration from Week 3
if the core agent is working. - Inspect tool selection, execution and
the final response. - Handle invalid tool inputs and tool failures.

Deliverable: A working ADK document assistant that can use a
controlled tool and explain its result.
Week 5 · December 14--20
Focus: ADK workflows, state and routing

Goal: Move from one tool-using agent to a controlled multi-step
workflow.

Activities: - Understand agent state and session state. - Explore
sequential and parallel workflow patterns. - Learn conditional routing
and agent delegation. - Define explicit workflow paths for document Q&A
and document summarization. - Add a second tool or specialized agent. -
Handle missing information and unsupported requests. - Inspect
intermediate state and record why a route was selected. - Compare
workflow orchestration with unconstrained agent loops.

Deliverable: A multi-step ADK workflow with state, at least two
execution paths and observable decisions.
Week 6 · December 21--27
Focus: LangGraph fundamentals and framework comparison

Goal: Understand graph-based orchestration and compare it with ADK.

Activities: - Learn graphs, nodes, edges and shared state. - Understand
conditional edges and termination conditions. - Reimplement a small part
of the Week 5 workflow using LangGraph. - Inspect state between nodes. -
Handle errors and invalid transitions. - Compare ADK and LangGraph in
state management, routing, tool integration, debugging and execution
control. - Decide which framework is appropriate for which type of
workflow.

Deliverable: A working LangGraph workflow and a concise
ADK-versus-LangGraph comparison.
Phase 3 --- Return to RAG
Week 7 · December 28--January 3
Focus: Conversational RAG and follow-up questions

Goal: Make the existing document assistant understand follow-up
questions using persistent conversation history.

Activities: - Trace the current request from Next.js through Express to
FastAPI. - Distinguish the current question, original question,
conversation history, resolved query and retrieved evidence. - Load a
bounded number of recent messages from the thread. - Pass the history to
the AI service through the existing service boundary. - Implement
follow-up query resolution. - Use the resolved query for retrieval while
preserving the original user question. - Generate an answer using
retrieved evidence and relevant conversation context. - Test follow-ups,
topic changes, empty history and isolated new threads.

Deliverable: A multi-turn conversational RAG flow that continues to
work after refreshing and reopening a thread.
Week 8 · January 4--10
Focus: RAG quality, grounding and citations

Goal: Improve answer reliability using the original evaluation set.

Activities: - Run the original baseline questions against the updated
application. - Compare retrieved chunks and answers with the baseline. -
Inspect missed or irrelevant evidence. - Improve the generation prompt
to distinguish supported from unsupported claims. - Add source metadata
and chunk/page references where available. - Test questions requiring
evidence from multiple chunks. - Make one targeted retrieval, chunking
or ranking improvement. - Record what improved and what did not.

Deliverable: A more grounded RAG implementation with source
references and a before/after evaluation report.
Phase 4 --- Agentic RAG and application integration
Week 9 · January 11--17
Focus: Integrate tools, MCP, ADK and RAG

Goal: Build a controlled agentic document workflow using the
capabilities learned independently.

Activities: - Define the agent's responsibilities and allowed tools. -
Expose document retrieval as a controlled tool. - Connect the MCP
document operation to the agent. - Decide when the agent should retrieve
document evidence and when it should use another tool. - Keep retrieval
and answer generation grounded in the source document. - Preserve thread
and user authorization boundaries. - Test tool selection, retrieval
failures and unsupported questions.

Deliverable: A demonstrable agentic document assistant that uses RAG
and at least one MCP-exposed capability.
Week 10 · January 18--24
Focus: Workflow persistence, recovery and human approval

Goal: Understand production-oriented workflow control.

Activities: - Learn checkpointing and persisted workflow state. -
Understand retries, idempotency and partial failures. - Add a human
approval step before a consequential action. - Resume a paused
workflow. - Verify retries do not duplicate actions. - Demonstrate
paused, approved, rejected and resumed paths. - Compare how the chosen
orchestration framework supports these behaviours.

Deliverable: A recoverable workflow with a demonstrated
human-in-the-loop path.
Week 11 · January 25--31
Focus: Full-stack AI workflow interface

Goal: Expose the workflow through the existing application rather
than building a separate tutorial UI.

Activities: - Define the UI/API contract for workflow requests and
progress. - Integrate the Next.js UI with Express and FastAPI. - Display
conversation messages, retrieved evidence and tool results. - Display
workflow status and approval requests where relevant. - Handle loading,
success, empty and error states. - Prevent duplicate submissions. -
Verify authentication and authorization across the flow.

Deliverable: A usable full-stack interface for the AI workflow.
Week 12 · February 1--7
Focus: Deployment and reproducible development

Goal: Make the implementation easier to run, test and demonstrate.

Activities: - Review service boundaries and environment configuration. -
Learn Docker images, containers, ports and environment variables. -
Create a reproducible development setup or containerize one service. -
Add a basic CI check for relevant tests/builds. - Validate API contracts
and deployment configuration. - Document how to run and deploy the
application. - Verify the deployed workflow end to end.

Deliverable: An end-to-end AI feature with reproducible setup and
basic CI.
Phase 5 --- Production credibility and career readiness
Week 13 · February 8--14
Focus: Evaluation, observability and reliability

Goal: Gather evidence that the application works reliably, not just
in a happy-path demo.

Activities: - Compare the final RAG evaluation set with the original
baseline. - Track workflow outcomes, tool calls and tool failures. - Add
structured logs and correlation IDs where useful. - Inspect latency and
failure points. - Add high-value integration tests. - Verify user,
thread and document authorization boundaries. - Document known
limitations and failure modes. - Update the README with architecture and
workflow diagrams. - Record a short project demo.

Deliverable: An AI application with evaluation evidence,
observability, tests and documented limitations.
Week 14 · February 15--21
Focus: Interview readiness and project presentation

Activities: - Explain the architecture without notes. - Practise RAG,
embeddings, retrieval, tool calling, MCP, ADK and LangGraph questions. -
Explain state management, workflow recovery, security and design
trade-offs. - Practise one Python or TypeScript coding exercise. -
Prepare a project walkthrough covering a real request from UI to AI
service and back. - Draft accurate resume bullets based only on
implemented work. - Apply to a focused batch of relevant roles and
record feedback.

Deliverable: Project walkthrough, architecture notes and interview
preparation material.
Week 15 · February 22--28
Focus: Gap closure and market feedback

Activities: - Review recruiter and interview feedback. - Identify
repeated skill gaps. - Improve one meaningful weakness. - Rehearse the
project demo and architecture discussion. - Tailor the resume for AI
application and full-stack roles. - Set the next learning priority based
on evidence from applications and interviews.

Deliverable: A targeted next-step plan based on market feedback.
Weekly time allocation
Target 6.5 hours per week, with flexibility between 6 and 7 hours.

  Activity                                                 Target
  Concepts, reading and architecture discussion         1.5 hours
Implementation and testing                              4 hours
Review, debugging notes and documentation                1 hour
Total                                         6.5 hours

A practical weekly rhythm is three sessions of roughly 2 hours plus a
short 30-minute review, or two longer sessions and one shorter session.
The exact days can change; protect the weekly total.
Parallel track — Job-market validation (runs every week)
This is not a separate phase and does not wait until the learning roadmap is complete. It runs alongside every technical milestone so the learning priorities stay connected to actual hiring demand.

**Weekly time budget: 30–45 minutes, included within your overall 6–7 hour weekly commitment. This is a lightweight research loop, not a daily application quota.
Weekly market-validation routine
1. Scan roles (10–15 minutes): review a small, relevant sample of AI Engineer, AI Application Engineer, AI Platform Engineer and Full-Stack AI Engineer roles across job portals and startup career pages. Include remote/international roles when relevant to the search.
2. Extract recurring requirements (10–15 minutes): note repeated technologies, experience expectations, deployment skills, evaluation/observability expectations and responsibilities. Separate frequent requirements from one-off wishlist items.
3. Compare against evidence (5–10 minutes): classify each recurring requirement as demonstrated in the project, known but not demonstrated, currently learning, or a genuine gap.
4. Choose one action (5 minutes): decide whether to keep the roadmap unchanged, adjust emphasis, create a small proof-of-skill task, or apply to a suitable role.
Keep a lightweight job-market tracker
For each useful job description, record:
- Role title, company, location/remote status and link.
- Required skills versus preferred skills.
- Repeated responsibilities and expected ownership level.
- Relevant gaps or evidence already available in the project.
- Whether to apply, save for later, or ignore (with a short reason).
Do not try to analyse every job description. A small, consistent sample of relevant roles is more useful than a large pile of unfiltered listings.
Monthly decision gate
At the end of every four weeks, review the accumulated job descriptions and any recruiter/interview feedback. Ask:
- Which skills appear repeatedly across credible target roles?
- Which of those skills are missing from the roadmap or not yet demonstrated?
- Are we spending too much time on a framework or topic that rarely appears in target roles?
- Are there repeated requirements that should move earlier?
- Are applications producing responses, screening calls or technical interviews? If not, is the likely issue role targeting, resume evidence, seniority fit or a demonstrable skill gap?
Make at most one or two meaningful roadmap changes at each review. Do not pivot because of one unusual job description or one rejection. Look for patterns across multiple roles and feedback points.
Pivot rules
- Keep the roadmap: when the current topics align with repeated requirements and there is no strong contrary evidence.
- Adjust emphasis: when a skill already on the roadmap appears frequently; give it more implementation depth without necessarily adding another week.
- Move a topic earlier: when multiple relevant job descriptions repeatedly require it and it is a prerequisite for roles being targeted.
- Defer a topic: when it has low demand in the target role sample and is not a prerequisite for the project's core outcome.
- Change target roles or positioning: only after reviewing a meaningful sample of job descriptions and application outcomes, not based on a single rejection.
The roadmap is therefore a hypothesis that is tested against the market every week, not a fixed syllabus that must be completed unchanged.
Working rules
1. One milestone at a time. Do not jump ahead because a framework
   feature looks interesting.
2. Understand the protocol/framework concept before implementing it.
3. Use the existing project wherever practical; create small isolated
   prototypes only when they help explain a concept.
4. Keep tool execution deterministic and validated in application code.
5. Enforce authentication, ownership and authorization outside the
   model's decision-making.
6. Test deployed behaviour using the existing Vercel and Render
   deployments when the feature is integrated.
7. Compare RAG improvements against the original evaluation set.
8. Do not put ADK and LangGraph into the same production execution path
   merely to use both. Learn and compare them; choose deliberately.
9. Keep document-grounded answers separate from independent
   verification.
10. Update the resume only after there is working implementation
    evidence.
What is intentionally deferred
To protect the 6--7 hour weekly commitment, these are not immediate
blockers: - Advanced PDF extraction and layout-aware parsing -
Sophisticated chunking and reranking - Large-scale evaluation datasets -
Streaming responses - Multiple cooperating agents beyond the core
workflow - Production-grade deployment infrastructure - Advanced
observability platforms

Revisit these only when a measured limitation or project requirement
justifies the effort.
Primary outcome
A demonstrable full-stack AI application that shows: - Reliable document
ingestion and RAG - Persistent, multi-turn conversations - LLM tool
calling with validation and failure handling - An MCP server/client
integration - Practical Google ADK agent and workflow experience -
LangGraph fundamentals and an informed framework comparison - A
controlled agentic RAG workflow - Evaluation, observability,
authorization and production-oriented engineering practices

The objective is not to collect framework names. It is to be able to
explain, implement, test and defend the architecture and its trade-offs.