# docs (backend)

Development-cycle documentation **for the service only**.

What belongs here: how a part of the service works once it is built, the migration and seeding
procedure, operational notes, anything about running it locally.

What does not:

| | It lives in |
|---|---|
| What the product does, and why | [`../../../requirements/`](../../../requirements/) |
| How the data is stored | [`../../../requirements/DATA-MODEL.md`](../../../requirements/DATA-MODEL.md) |
| Anything true for both apps | [`../../../docs/`](../../../docs/) |
| The layers and discipline rules of this app | [`../AGENTS.md`](../AGENTS.md) |

Empty for now, on purpose. A document earns its place when the knowledge is hard to rebuild by
reading the code. If someone finds it in thirty seconds by opening a file, don't write it.
