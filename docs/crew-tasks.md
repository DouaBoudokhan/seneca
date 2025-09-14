# Crew Tasks Reference

This document describes the three tasks defined in `src/hack_seneca/crew.py`, how they behave, what they expect as inputs/outputs, and important edge cases. Use it when adding features, debugging behavior, or writing tests.

- Source file: `src/hack_seneca/crew.py`
- Related agents: Manager, Fitness Coach, Nutritionist
- Image tool: `FluxImageGenerator` (wired to Nutritionist agent)

---

## Nutritionist Task (`create_nutritionist_task`)

### Purpose (Nutritionist)

Provide concise, personalized nutrition guidance. When suggesting any meal(s), automatically generate an appetizing image using `FluxImageGenerator` with a detailed visual description.

### Inputs — Nutritionist

- `user_message`: The user’s request or question (nutrition-oriented)
- `user_id`: Identifier for personalization
- `user_profile`: Profile summary
- `user_activities`: Recent logged activities
- `user_measurements`: Body measurements
- `user_nutrition`: Recent intake/logs
- `context`: Conversation history / extra context

### Rules — Nutritionist

- Keep guidance concise and practical.
- If suggesting meals, provide 1–3 specific recipes with:
  - Ingredients
  - Macros (calories, protein, carbs, fats)
- ALWAYS generate a meal image (one per suggestion is acceptable) using `FluxImageGenerator`.
  - Call the tool with a single string: a vivid, detailed description of the meal’s presentation (no JSON).
  - Describe plating, colors, textures, lighting, camera angle if helpful.
  - Images should be saved under `assets/images/` using a timestamped filename (handled by the tool).
- Fatigue awareness: If the message contains “IMPORTANT: Voice analysis detected” or indicates tiredness, acknowledge fatigue and prefer simpler, low-effort meals.
- If the request is NOT about meals/food/diet/pasta/nutrition/recipes, respond with `Not applicable` and DO NOT generate images.

### Outputs — Nutritionist

- Primary text: “Concise nutrition guidance with specific meal suggestions and generated meal images when applicable.”
- Side-effect: One or more images created in `assets/images/` by `FluxImageGenerator` (when meal suggestions are present).

### Tooling: FluxImageGenerator (contract)

- Input: plain text string — the image description.
- Output: Generates and saves an image file under `assets/images/` using a timestamped name and returns the saved path.
- Usage: The Nutritionist agent has `tools=[self.flux_tool]` and `function_calling_llm=self.llm`, so it can invoke the tool autonomously.

### Edge Cases — Nutritionist

- Non-nutrition queries: Must return `Not applicable` and avoid tool calls.
- Fatigued users: Prefer 10–20 minute prep, minimal steps, simple ingredients.
- Multiple meal suggestions: It’s fine to generate one image per suggestion; ensure descriptions differ.

### Example image prompts — Nutritionist

- “Overhead shot of a single-serve salmon poke bowl: cubed salmon, bright edamame, sliced cucumber, shredded purple cabbage, white sesame on jasmine rice, drizzled with light soy-ginger dressing, clean white ceramic bowl on light wood table, soft natural daylight.”
- “Close-up of creamy pesto pasta with grilled chicken: al dente fusilli coated in vibrant green basil pesto, thin shavings of parmesan, cherry tomatoes halved, fresh basil leaves, matte stone plate, soft side lighting.”

---

## Fitness Task (`create_fitness_task`)

### Purpose (Fitness)

Provide a complete workout plan including exercises, sets, reps, and rest. Adapt intensity if the user appears fatigued.

### Inputs — Fitness

- `user_message`
- `user_profile`
- `user_activities`
- `user_measurements`
- `context`

### Rules — Fitness

- If the request is about workouts, deliver a structured plan that includes:
  - Specific exercise names
  - Sets, reps, and rest per exercise
  - 1–2 progression guidelines
  - Safety/form notes
- Fatigue awareness: If voice analysis indicates tiredness, provide gentler/shorter sessions with more rest.
- If the request is about meals/nutrition/recipes/pasta, respond `Not applicable` and DO NOT provide an answer.

### Outputs — Fitness

- Primary: A clear, structured workout plan; or `Not applicable` if the request is not fitness-related.

### Edge Cases — Fitness

- Ambiguous requests framed as food: must return `Not applicable` (nutrition domain).
- Minimal equipment or constraints: include substitutions where reasonable.

---

## Manager Task (`create_main_task`)

### Purpose (Manager)

Analyze the user’s request and delegate to the correct specialist (Fitness Coach or Nutritionist) with full context, ensuring personalized, comprehensive responses.

### Inputs — Manager

- `user_message`
- `user_id`
- `user_profile`
- `user_activities`
- `user_measurements`
- `user_nutrition`
- `context` (conversation history)

### Delegation Rules — Manager (critical)

- Delegate to FITNESS COACH for:
  - Workout plans or exercise routines
  - Training programs (PPL, splits, full body, etc.)
  - Exercise selection/form guidance
  - Strength or cardio programming
- Delegate to NUTRITIONIST for:
  - Meal plans, recipe suggestions
  - Diet advice, macros/calorie planning
  - Supplement recommendations
  - Healthy eating strategies
  - Meal image generation or any food/meal/eating request
- Special note: “pasta plan” is nutrition — delegate to Nutritionist only.
- If intent is unclear or it’s just a greeting, ask a brief clarifying question first; do not delegate prematurely.

### Fatigue Handling — Manager

If the message contains “IMPORTANT: Voice analysis detected” or mentions tiredness, ensure the delegated specialist acknowledges fatigue and adapts recommendations (simpler meals or gentler workouts).

### Outputs — Manager

A comprehensive personalized response from the appropriate specialist (workout plan or nutrition guidance). The Manager itself primarily coordinates — it does not provide domain answers directly when intent is clear.

### Edge Cases — Manager

- Cross-domain questions: split or redirect appropriately; never let Fitness Coach answer nutrition or vice versa.
- Missing user data fields: proceed with best-effort guidance; call out any assumptions.

---

## Quick wiring notes

- Agents are created once and reused across tasks in `FitnessCrew`.
- Nutritionist agent has `tools=[self.flux_tool]` and can call `FluxImageGenerator`.
- The crew is created with `process=Process.hierarchical` and `manager_llm=self.llm`; the Manager delegates to specialists.

## Acceptance checks (for QA)

- Nutritionist returns concise text + generates images for any meal suggestion; skips images when “Not applicable”.
- Fitness coach never answers nutrition; returns “Not applicable” for food-related requests.
- Manager routes “pasta” and all food/meal topics to Nutritionist; asks clarifying question when intent is ambiguous.
- Fatigue cues reduce complexity/intensity as specified.
