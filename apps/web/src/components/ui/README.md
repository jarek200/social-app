# UI Components Library

A collection of reusable UI components for consistent design across the social app.

## Components

### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@components/ui";

// Primary button (default)
<Button onClick={handleClick}>Click me</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Danger button
<Button variant="danger">Delete</Button>

// With loading state
<Button loading={isLoading}>Submit</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "danger" | "success" | "warning"
- `size`: "sm" | "md" | "lg"
- `disabled`: boolean
- `loading`: boolean
- `onClick`: function
- `type`: "button" | "submit" | "reset"

### Input
A styled input component with consistent focus states.

```tsx
import { Input } from "@components/ui";

<Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onInput={handleInput}
  required
/>
```

**Props:**
- `type`: "text" | "email" | "password" | "number" | "tel" | "url"
- `placeholder`: string
- `value`: string
- `disabled`: boolean
- `required`: boolean
- `onInput`: function
- `onChange`: function

### Textarea
A styled textarea component.

```tsx
import { Textarea } from "@components/ui";

<Textarea
  placeholder="Enter your message"
  value={message}
  rows={4}
  onInput={handleInput}
/>
```

**Props:**
- `placeholder`: string
- `value`: string
- `disabled`: boolean
- `required`: boolean
- `rows`: number
- `onInput`: function
- `onChange`: function

### Card
A container component with consistent styling.

```tsx
import { Card } from "@components/ui";

<Card padding="md">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

**Props:**
- `padding`: "sm" | "md" | "lg"
- `class`: string

### Badge
A status indicator component.

```tsx
import { Badge } from "@components/ui";

<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>
```

**Props:**
- `variant`: "success" | "warning" | "danger" | "info" | "neutral"
- `size`: "sm" | "md"

### Alert
A notification component for messages.

```tsx
import { Alert } from "@components/ui";

<Alert variant="success">Operation completed successfully!</Alert>
<Alert variant="danger">An error occurred</Alert>
<Alert variant="warning">Please check your input</Alert>
```

**Props:**
- `variant`: "success" | "warning" | "danger" | "info"

### LoadingSpinner
A loading indicator component.

```tsx
import { LoadingSpinner } from "@components/ui";

<LoadingSpinner size="md" />
```

**Props:**
- `size`: "sm" | "md" | "lg"

## Usage Examples

### Form with Validation
```tsx
import { Button, Input, Alert } from "@components/ui";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <form>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onInput={(e) => setEmail(e.target.value)}
      />
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Button type="submit">Sign In</Button>
    </form>
  );
}
```

### Status Display
```tsx
import { Card, Badge } from "@components/ui";

function PostCard({ post }) {
  return (
    <Card>
      <h3>{post.title}</h3>
      <Badge variant={post.status === "approved" ? "success" : "warning"}>
        {post.status}
      </Badge>
    </Card>
  );
}
```

## Design System

All components follow the app's design system:

- **Colors**: Brand colors with semantic variants
- **Spacing**: Consistent padding and margins
- **Typography**: Inter font family with proper weights
- **Border Radius**: Rounded corners for modern look
- **Focus States**: Accessible focus indicators
- **Transitions**: Smooth hover and state changes

## Benefits

1. **Consistency**: All components share the same design language
2. **Maintainability**: Changes to styles are centralized
3. **Accessibility**: Built-in accessibility features
4. **Performance**: Optimized for bundle size
5. **Type Safety**: Full TypeScript support
6. **Reusability**: Easy to use across different pages

## Migration Guide

To migrate existing components to use the UI library:

1. Import the component: `import { Button } from "@components/ui"`
2. Replace the old element: `<button>` → `<Button>`
3. Update props: `class="..."` → `variant="primary"`
4. Remove custom styling: Let the component handle styling
5. Test functionality: Ensure all interactions work correctly
