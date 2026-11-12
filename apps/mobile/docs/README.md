# docs (mobile)

Development-cycle documentation **for the client only**.

## agents/

The **normative** layer: what new code has to comply with. Everything else in this folder is
descriptive, meaning it explains how something that already exists works.

| File | |
|---|---|
| [`agents/architecture.md`](agents/architecture.md) | The layers, which way they depend, where state lives, and the reasoning behind each call |
| [`agents/development-rules.md`](agents/development-rules.md) | Tooling, TypeScript settings, imports, naming, styling |
| [`agents/anti-patterns.md`](agents/anti-patterns.md) | The named wrong shapes, each one the reverse of a discipline rule |
| [`agents/design-system.md`](agents/design-system.md) | How a design system token reaches the screen, the component map, and where the code departs from the system |

The git workflow is **not** here: it is the same for both apps and lives at
[`../../../docs/agents/git-workflow.md`](../../../docs/agents/git-workflow.md).

What belongs here: how a feature of this app works once it is built, navigation and state decisions,
Expo build and release notes, anything about running it on a device.

What does not:

| | It lives in |
|---|---|
| What the product does, and why | [`../../../requirements/`](../../../requirements/) |
| Anything true for both apps | [`../../../docs/`](../../../docs/) |
| The layers and discipline rules of this app | [`../AGENTS.md`](../AGENTS.md) |

## screens/

How a built screen works, one document per screen, and only when the knowledge is hard to rebuild
by reading the code.

| File | |
|---|---|
| [`screens/today.md`](screens/today.md) | The Hoy tab: its five states, how it spends the vertical budget, and what it drops from the prototype |
| [`screens/auth.md`](screens/auth.md) | Login and Signup: the layers down to the API, the session and where it is stored, and the routing gate |

The asset pipeline lives outside this folder, documented next to the files it describes:
[`../assets/README.md`](../assets/README.md).

A document earns its place when the knowledge is hard to rebuild by reading the code. If someone
finds it in thirty seconds by opening a file, don't write it.
