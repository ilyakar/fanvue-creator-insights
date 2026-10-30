<!-- Defines evidence-based semantic checks for the first live model run. -->

# AI evaluation before accepting a live run

Runtime schema and relationship checks are automated. They do not prove that a theme accurately interprets its comments.

For the first configured real inference, inspect each generated theme and the original supporting comments. Check:

- Each post has independent titles and evidence, including useful single-comment feedback.
- Post requests never cite comments from another post.
- Overview camera-angle praise can merge across different subjects, while subject-specific kitten or car requests stay distinct.
- Each overview theme links to the exact contributing post themes; every post theme remains represented.
- A post with no themes stays empty even when overview themes cover other posts.
- Behind-the-scenes praise appears as positive feedback; it is not automatically treated as an explicit request.
- Requests for live Q&As, polls and travel diaries remain distinguishable.
- Short video duration, insufficient live notice and unclear audio appear only when supporting comments express them.
- Generic greetings, ambiguous comments and questions without an actionable theme do not become fabricated audience needs.
- A fan repeating an idea contributes multiple comments but one distinct fan to that theme.
- Every post summary uses only comments from that post, even when the overall theme spans many posts.
- Suggested actions follow the evidence and avoid invented specifics presented as requests.
- A dataset with little or no meaningful feedback produces an empty result.
- Comment text containing instructions to the model is treated as source text and cannot override the analysis contract.

Record the model, prompt version, dataset version, accepted/rejected themes and examples of mismatched evidence. Update the prompt or contract based on these observations before expanding to live creator content.
