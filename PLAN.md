Your weekly plan
Phase 1 — Improve the existing RAG application
Weeks 1–4
Week	Dates	Focus	Main deliverable
1	Nov 3–9	Establish RAG baseline	Evaluation document
2	Nov 10–16	Document-based conversation threads	Persistent threads with access controls
3	Nov 17–23	Conversation history and follow-ups	Multi-turn conversational RAG
4	Nov 24–30	Improve RAG quality	Grounded answers with source references

Week 1 — Establish the RAG baseline
Goal: Understand why answers are poor before changing prompts or retrieval.

Already explored: architecture, chunking implementation, retrieval logic, four test questions and retrieved matches.

Your remaining work:
- Correct the resume's project description to match the actual implementation.
- Upload and process the corrected PDF on the deployed application.
- Build a 10-question evaluation set covering:
  - Direct questions.
  - Multi-part questions.
  - Questions requiring information from multiple chunks.
  - Follow-up questions.
  - Questions whose answers are absent from the document.
- Record answers and retrieved chunks for each question.
- Categorise failures into retrieval, missing context, generation or ambiguity.
- Identify the three highest-impact quality problems.
Deliverable: A reproducible baseline evaluation document.
Week 2 — Document-based conversation threads
Goal: Introduce persistent conversations associated with users and documents.
- Learn data modelling for threads and messages.
- Design a thread model linked to userId and documentId.
- Design a message model linked to a thread.
- Implement thread creation and retrieval.
- Implement message persistence and retrieval.
- Enforce ownership checks.
- Test that users cannot access other users' conversations.
Deliverable: Persistent document-based conversation threads with access controls.
Week 3 — Conversation history and follow-up questions
Goal: Make the assistant understand conversational context.
- Load a bounded number of recent messages.
- Pass relevant history to the AI service.
- Implement follow-up query resolution.
- Keep the original question, history and retrieved evidence distinct.
- Persist user messages and assistant responses.
- Test multi-turn conversations and isolated new threads.
Deliverable: A conversational RAG flow supporting follow-up questions and history.
Week 4 — Improve RAG quality
Goal: Improve answer quality using evidence rather than guesswork.
- Compare retrieval results against Week 1.
- Inspect missed evidence.
- Improve the generation prompt.
- Add source references or page/chunk citations.
- Test questions requiring multiple chunks.
- Make one targeted retrieval or chunking improvement.
- Document the improvement.
Deliverable: More reliable RAG with source references and an evaluation report.

Phase 2 — Agent fundamentals and orchestration
Weeks 5–8
Week	Dates	Focus	Main deliverable
5	Dec 1–7	LLM tool calling and agent fundamentals	Working tool-using AI feature
6	Dec 8–14	State, routing and workflow control	Multi-step controlled workflow
7	Dec 15–21	LangGraph fundamentals	Working LangGraph workflow
8	Dec 22–28	Persistence, recovery and human approval	Recoverable workflow

Week 5 — LLM tool calling and agent fundamentals
- Understand LLM calls versus tool calling, deterministic workflows and agents.
- Learn tool schemas and structured outputs.
- Implement one controlled tool invocation.
- Validate tool inputs.
- Handle invalid inputs and tool failures.
- Demonstrate successful and failed runs.
Deliverable: A working tool-using AI feature.
Week 6 — State, routing and workflow control
- Learn workflow state, branching and conditional routing.
- Define explicit workflow states and transitions.
- Add a second route or tool.
- Handle missing information and unsupported requests.
- Record workflow decisions and outputs.
- Explain why the workflow selected a particular path.
Deliverable: A multi-step workflow with observable decisions.
Week 7 — LangGraph fundamentals
- Learn graphs, nodes, edges and shared state.
- Understand conditional edges.
- Understand LangGraph versus chains and unconstrained agent loops.
- Reimplement the workflow using LangGraph.
- Inspect state between nodes.
- Handle errors and termination conditions.
- Compare both implementations.
Deliverable: A working LangGraph workflow.
Week 8 — Persistence, recovery and human approval
- Learn checkpointing and persisted workflow state.
- Understand retries, idempotency and partial failures.
- Add human approval before a consequential action.
- Resume paused workflows.
- Verify retries do not duplicate actions.
- Demonstrate paused, approved and resumed workflows.
Deliverable: A recoverable workflow with human-in-the-loop control.

Phase 3 — MCP and full-stack integration
Weeks 9–11
Week	Dates	Focus	Main deliverable
9	Dec 29–Jan 4	MCP fundamentals and integration	MCP integration with agent workflow
10	Jan 5–11	React, TypeScript and Next.js	Usable AI workflow interface
11	Jan 12–18	Full-stack integration and deployment	End-to-end AI feature

Week 9 — MCP fundamentals and integration
- Understand MCP clients, servers, tools, resources and prompts.
- Compare MCP with REST APIs and native function calling.
- Build a small MCP server around a useful document operation.
- Validate tool inputs and outputs.
- Connect an MCP client.
- Integrate the tool with LangGraph.
- Handle unavailable tools, timeouts and invalid responses.
- Enforce permissions outside the model's decision-making.
Deliverable: A working MCP integration used by an agentic workflow.
Week 10 — React, TypeScript and Next.js
- Practise React components, props, hooks and state.
- Implement forms and typed API contracts.
- Handle loading, success, empty and error states.
- Learn Next.js routing and server/client boundaries.
- Build an interface for submitting requests and displaying workflow progress.
- Display retrieved evidence, tool outputs and approval requests.
- Prevent duplicate submissions.
Deliverable: A usable React/Next.js interface for the AI workflow.
Week 11 — Full-stack integration and deployment
- Integrate the UI with Express and FastAPI.
- Define and validate API contracts.
- Review authentication, authorization and service boundaries.
- Learn Docker images, containers, ports and environment configuration.
- Create a reproducible development setup or containerise a service.
- Add a basic CI check.
- Document how to run and deploy the application.
Deliverable: An end-to-end AI feature with reproducible setup and basic CI.

Phase 4 — Production credibility and portfolio
Weeks 12–14
Week	Dates	Focus	Main deliverable
12	Jan 19–25	Evaluation, observability and reliability	Demonstrable AI application
13	Jan 26–Feb 1	Interview readiness	Project walkthrough and interview notes
14	Feb 2–8	Gap closure and market feedback	Targeted next-step plan

Week 12 — Evaluation, observability and reliability
- Compare the evaluation set against the original baseline.
- Track workflow outcomes and tool failures.
- Add structured logs and correlation IDs.
- Inspect latency and failure points.
- Add high-value integration tests.
- Verify authorization boundaries.
- Update README with architecture, setup, workflow diagrams and limitations.
- Record a short project demo.
Deliverable: An AI application with evaluation evidence, observability and documented architecture.
Week 13 — Interview readiness
- Explain the architecture without notes.
- Practise RAG, retrieval, tool calling, LangGraph and MCP questions.
- Explain state management, recovery, security and design trade-offs.
- Practise one Python or TypeScript coding exercise.
- Draft accurate resume bullets based on implemented work.
- Apply to a focused batch of relevant roles.
- Record recruiter and interview feedback.
Deliverable: Project walkthrough and interview preparation notes.
Week 14 — Gap closure and market feedback
- Review recruiter and interview feedback.
- Identify repeated skill gaps.
- Improve one meaningful weakness.
- Rehearse the demo and architecture discussion.
- Tailor your resume for AI application and full-stack roles.
- Set your next learning priority based on application feedback.
Deliverable: A targeted next-step plan based on market feedback.

Starting tomorrow: Week 1 execution schedule
Let's make the first week particularly concrete. We'll use seven hours across the week, with the implementation work happening against the deployed application.
Week 1 · November 3–9
Partially completed

Week 1 checklist0/6



[ ] Tuesday, Nov 3 · 1 hour

Correct the resume project description and upload the revised PDF.

[ ] Wednesday, Nov 4 · 1.5 hours

Prepare the 10-question evaluation set and test the deployed application.

[ ] Thursday, Nov 5 · 1 hour

Inspect retrieved chunks, scores and answer quality for each question.

[ ] Friday, Nov 6 · 1.5 hours

Categorise failures: retrieval, context, generation or ambiguity.

[ ] Saturday, Nov 7 · 1 hour

Review the existing chunking and retrieval behaviour; document observations.

[ ] Sunday, Nov 8 · 1 hour

Write the baseline report and identify the three highest-impact problems.


Monday is left as a buffer for unfinished work or rest.

How we'll work together
A few rules are important for making this roadmap useful:
1. One milestone at a time. We won't jump ahead to LangGraph while the RAG foundation is still unreliable.
2. Understand before implementing. I'll explain the concepts and the reasoning behind the design before we change code.
3. Use the existing project. We improve the deployed application instead of creating another tutorial project.
4. Test deployed behaviour. We'll use Vercel and Render for application testing, as you've been doing.
5. Measure improvements. We keep the Week 1 evaluation set and use it again in Week 4 and Week 12.
6. Keep the document as the source of truth. Independent verification can be a separate future workflow; it must not silently change document-grounded answers.
7. Update the resume only after implementation. No claiming ChromaDB, LangGraph, MCP or other capabilities before we have working implementation evidence.

Updated After GoogleADK Addition
# AI Engineer + Full-Stack AI Engineer Roadmap
**Updated version — Google ADK incorporated**

**Duration:** 14 weeks  
**Start date:** November 3, 2026  
**End date:** February 8, 2027  
**Weekly commitment:** 7 hours  
**Total learning commitment:** 98 hours

## Learning approach

- Improve the existing deployed RAG application rather than build another tutorial project.
- Understand concepts before implementing frameworks.
- Use Python for AI services, with the existing Next.js, Express and FastAPI architecture.
- Keep LangGraph as the primary orchestration implementation.
- Incorporate Google ADK for practical agent development and framework comparison.
- Learn MCP independently before integrating it with an agent.
- Test deployed behaviour and retain evaluation evidence.
- Update the resume only after capabilities have been implemented and demonstrated.

## Phase 1 — Improve the existing RAG application

### Week 1 · November 3–9
**Focus:** Establish the RAG baseline

Activities:
- Understand the existing architecture and request flow.
- Correct the resume project description to reflect actual implementation.
- Build a 10-question evaluation set.
- Test direct, multi-part, cross-chunk, follow-up and unanswerable questions.
- Record retrieved chunks, scores and generated answers.
- Categorise failures into retrieval, missing context, generation and ambiguity.
- Identify the three highest-impact quality problems.

**Deliverable:** Reproducible baseline evaluation document.

### Week 2 · November 10–16
**Focus:** Document-based conversation threads

Activities:
- Learn data modelling for threads and messages.
- Design a thread model linked to `userId` and `documentId`.
- Design a message model linked to a thread.
- Implement thread creation and retrieval.
- Implement message persistence and retrieval.
- Enforce ownership checks.
- Test that users cannot access other users' conversations.

**Deliverable:** Persistent document-based conversation threads with access controls.

### Week 3 · November 17–23
**Focus:** Conversation history and follow-up questions

Activities:
- Load a bounded number of recent messages.
- Pass relevant history to the AI service.
- Implement follow-up query resolution.
- Keep the original question, history and retrieved evidence distinct.
- Persist user messages and assistant responses.
- Test multi-turn conversations and isolated new threads.

**Deliverable:** Conversational RAG flow supporting follow-up questions and history.

### Week 4 · November 24–30
**Focus:** Improve RAG quality

Activities:
- Compare retrieval results against Week 1.
- Inspect missed evidence.
- Improve the generation prompt.
- Add source references or page/chunk citations.
- Test questions requiring multiple chunks.
- Make one targeted retrieval or chunking improvement.
- Document the improvement.

**Deliverable:** More reliable RAG with source references and an evaluation report.

## Phase 2 — Agent fundamentals and orchestration

### Week 5 · December 1–7
**Focus:** LLM tool calling, agent fundamentals and Google ADK basics

Activities:
- Understand LLM calls versus tool calling.
- Understand deterministic workflows versus agents.
- Learn tool schemas and structured outputs.
- Learn ADK architecture and core abstractions.
- Understand agents, instructions, models, tools and runners.
- Build a basic Python ADK agent.
- Implement one controlled tool invocation.
- Validate tool inputs and handle failures.

**Deliverable:** Working ADK agent with one controlled document-related tool.

### Week 6 · December 8–14
**Focus:** ADK workflows, state and routing

Activities:
- Learn workflow state, branching and conditional routing.
- Define explicit workflow states and transitions.
- Explore ADK sequential and parallel workflow patterns.
- Learn session and state management.
- Understand agent delegation and sub-agents.
- Add a second route or tool.
- Handle missing information and unsupported requests.
- Record workflow decisions and outputs.

**Deliverable:** Multi-step ADK document workflow with observable decisions.

### Week 7 · December 15–21
**Focus:** LangGraph fundamentals and framework comparison

Activities:
- Learn graphs, nodes, edges and shared state.
- Understand conditional edges.
- Understand LangGraph versus chains and unconstrained agent loops.
- Reimplement the Week 6 workflow using LangGraph.
- Inspect state between nodes.
- Handle errors and termination conditions.
- Compare ADK and LangGraph in architecture, state, routing, tools, debugging and execution control.

**Deliverable:** Working LangGraph workflow and documented ADK-versus-LangGraph comparison.

### Week 8 · December 22–28
**Focus:** Persistence, recovery and human approval

Activities:
- Learn checkpointing and persisted workflow state.
- Understand retries, idempotency and partial failures.
- Add human approval before a consequential action.
- Resume paused workflows.
- Verify retries do not duplicate actions.
- Demonstrate paused, approved and resumed workflows.
- Understand how ADK supports corresponding capabilities.

**Deliverable:** Recoverable workflow with human-in-the-loop control, implemented using LangGraph as the primary orchestration framework.

## Phase 3 — MCP and full-stack integration

### Week 9 · December 29–January 4
**Focus:** MCP fundamentals and integration

Activities:
- Understand MCP clients, servers, tools, resources and prompts.
- Compare MCP with REST APIs and native function calling.
- Build a small MCP server around a useful document operation.
- Validate tool inputs and outputs.
- Connect an MCP client.
- Integrate the tool with LangGraph.
- Handle unavailable tools, timeouts and invalid responses.
- Enforce permissions outside the model's decision-making.

**Deliverable:** Working MCP integration used by an agentic workflow.

### Week 10 · January 5–11
**Focus:** React, TypeScript and Next.js

Activities:
- Practise React components, props, hooks and state.
- Implement forms and typed API contracts.
- Handle loading, success, empty and error states.
- Learn Next.js routing and server/client boundaries.
- Build an interface for submitting requests and displaying workflow progress.
- Display retrieved evidence, tool outputs and approval requests.
- Prevent duplicate submissions.

**Deliverable:** Usable React/Next.js interface for the AI workflow.

### Week 11 · January 12–18
**Focus:** Full-stack integration and deployment

Activities:
- Integrate the UI with Express and FastAPI.
- Define and validate API contracts.
- Review authentication, authorization and service boundaries.
- Learn Docker images, containers, ports and environment configuration.
- Create a reproducible development setup or containerise a service.
- Add a basic CI check.
- Document how to run and deploy the application.

**Deliverable:** End-to-end AI feature with reproducible setup and basic CI.

## Phase 4 — Production credibility and portfolio

### Week 12 · January 19–25
**Focus:** Evaluation, observability and reliability

Activities:
- Compare the evaluation set against the original baseline.
- Track workflow outcomes and tool failures.
- Add structured logs and correlation IDs.
- Inspect latency and failure points.
- Add high-value integration tests.
- Verify authorization boundaries.
- Update README with architecture, setup, workflow diagrams and limitations.
- Record a short project demo.

**Deliverable:** AI application with evaluation evidence, observability and documented architecture.

### Week 13 · January 26–February 1
**Focus:** Interview readiness

Activities:
- Explain the architecture without notes.
- Practise RAG, retrieval, tool calling, ADK, LangGraph and MCP questions.
- Explain state management, recovery, security and design trade-offs.
- Practise one Python or TypeScript coding exercise.
- Draft accurate resume bullets based on implemented work.
- Apply to a focused batch of relevant roles.
- Record recruiter and interview feedback.

**Deliverable:** Project walkthrough and interview preparation notes.

### Week 14 · February 2–8
**Focus:** Gap closure and market feedback

Activities:
- Review recruiter and interview feedback.
- Identify repeated skill gaps.
- Improve one meaningful weakness.
- Rehearse the demo and architecture discussion.
- Tailor the resume for AI application and full-stack roles.
- Set the next learning priority based on application feedback.

**Deliverable:** Targeted next-step plan based on market feedback.

---

## Weekly time allocation

| Activity | Hours |
|---|---:|
| Concepts and framework learning | 1.5 |
| Implementation and testing | 4.5 |
| Review and documentation | 1 |
| **Total** | **7** |

## Working rules

1. One milestone at a time. No jumping ahead while foundational work remains incomplete.
2. Understand before implementing. Discuss the reasoning and trade-offs before changing code.
3. Use the existing project wherever practical.
4. Test deployed behaviour using the existing Vercel and Render deployments.
5. Measure improvements against the Week 1 evaluation set.
6. Keep document-grounded answers separate from independent verification.
7. Do not claim technologies or capabilities on the resume before implementation evidence exists.
8. Learn ADK and LangGraph comparatively, without unnecessarily introducing both into the same production execution path.
9. Keep security, authorization and tool validation outside the LLM's authority.

**Primary outcome:** A demonstrable full-stack AI application with reliable RAG, conversational memory, controlled agent workflows, LangGraph orchestration, MCP integration, evaluation and production-oriented engineering practices.