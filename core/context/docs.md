Context in React Native - Explained with Real Examples
What is Context?
Context is a way to share data between components without having to pass props manually at every level (prop drilling). Think of it as a global state that any component can access.

Real-World Analogy: Theme Settings
Imagine you have an app with light/dark mode. Without Context, you'd have to pass the theme through every component:

jsx
// ❌ WITHOUT CONTEXT - Prop Drilling Hell
<App theme="dark">
  <Header theme="dark">
    <Navbar theme="dark">
      <Button theme="dark" />
    </Navbar>
  </Header>
</App>
With Context, you create a "theme bucket" that any component can dip into:

jsx
// ✅ WITH CONTEXT - Clean Access
<ThemeProvider>  {/* Creates the "theme bucket" */}
  <App>
    <Header>
      <Navbar>
        <Button /> {/* Can access theme directly */}
      </Navbar>
    </Header>
  </App>
</ThemeProvider>
