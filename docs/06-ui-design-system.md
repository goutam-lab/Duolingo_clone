06 - UI Design System
1. Design Direction

The application should feel:

Playful
Gamified
Modern
Interactive
Friendly
Fast
Rewarding

It should resemble a real language-learning product.

Do not create a generic admin dashboard.

2. Main UI Areas
text
Top Navigation

Learning Path

Unit Sections

Skill Nodes

Lesson Player

Exercise Area

Feedback Area

Completion Modal

Profile

Leaderboard

Settings
3. Learning Path

The learning path is the primary screen.

It should contain:

Unit headers
Vertical path
Curved connectors
Skill nodes
Progress rings
Locked nodes
Available nodes
In-progress nodes
Completed nodes
Reward nodes
Mascot elements
4. Skill Nodes
Locked

Visual characteristics:

Muted
Lock icon
Reduced emphasis
Not clickable
Available

Visual characteristics:

Strong emphasis
Interactive
Clear CTA
Hover/tap animation
In Progress

Visual characteristics:

Progress ring
Partial completion
Clear current state
Completed

Visual characteristics:

Completion indicator
Full progress
Crown/mastery indication
5. Progress Ring

Use SVG.

Concept:

Background circle
Progress circle

The progress percentage comes from the backend.

Do not calculate authoritative progress in the frontend.

6. Path Connectors

Use SVG paths.

Do not use a static screenshot as the learning path.

The path should respond to different screen sizes.

7. Colors

Create a consistent semantic design system.

Suggested tokens:

primary
secondary
success
error
warning
info
background
surface
text
muted
border

Do not randomly hardcode colors inside components.

8. Typography

Use a clean modern sans-serif font.

Hierarchy:

Page Title
Section Title
Skill Title
Lesson Title
Body
Caption

Typography must remain readable on mobile.

9. Buttons

Primary button:

Strong emphasis
Rounded
Clear label
Press animation

Secondary button:

Lower visual emphasis

Disabled button:

Clearly disabled
Not interactive
10. Lesson Player

Layout:

text
Top Bar
    ↓
Progress
    ↓
Question
    ↓
Answer Area
    ↓
Feedback
    ↓
Continue Button
11. Feedback

Correct answer:

Positive visual state
Success message
Continue action

Incorrect answer:

Error visual state
Heart deduction
Feedback message
Continue action
12. Animations

Use Framer Motion for:

Skill unlock
Node interaction
Exercise transitions
Correct answer
Incorrect answer
XP reward
Completion modal
Toasts
Progress updates

Animations should be short.

Animations must not block interaction.

Support reduced-motion preferences.

13. Responsive Design

Desktop:

Centered content
Larger path
Comfortable spacing

Tablet:

Reduced spacing
Responsive node sizes

Mobile:

Full-width content
Touch-friendly controls
Smaller nodes
Reduced spacing
No horizontal overflow
14. Accessibility

Use:

Semantic HTML
Real buttons
Keyboard navigation
Focus states
ARIA labels where needed
Accessible form controls
Good contrast
Reduced-motion support
15. Visual References

Visual references may be stored in:

text
design/references/

Use them to understand:

Layout
Path geometry
Visual hierarchy
Spacing
Gamification patterns

Do not copy proprietary source code or proprietary assets.

Create original components and assets.