import { StrictMode, Suspense, lazy, useMemo } from 'react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './App.css';

/**
 * Generic dev-only preview harness.
 *
 * Renders any component under src/features/** (business screens) or
 * src/components/** (shared design-system primitives) in isolation, without
 * wiring it into App.tsx navigation or the AppPage routing union. New/modified
 * screens produced by the /ui-codegen prompt are viewable here immediately,
 * with no per-screen setup required.
 *
 * Usage:
 *   npm run dev
 *   http://localhost:5173/preview.html?component=login/Login
 *
 * The "component" query value is a path relative to src/features/ (preferred,
 * for business screens) or src/components/ (for shared primitives), without
 * the .tsx extension. Feature paths are tried first.
 */

const featureModules = import.meta.glob('./features/**/*.tsx');
const sharedModules = import.meta.glob('./components/**/*.tsx');
const modules = { ...featureModules, ...sharedModules };

function getRequestedComponentPath(): string | null {
  const params = new URLSearchParams(window.location.search);
  const value = params.get('component');
  return value ? value.replace(/^\/+|\/+$/g, '') : null;
}

function listAvailableComponents(): string[] {
  const features = Object.keys(featureModules).map((key) =>
    key.replace('./features/', '').replace(/\.tsx$/, '')
  );
  const shared = Object.keys(sharedModules).map((key) =>
    key.replace('./components/', '').replace(/\.tsx$/, '')
  );
  return [...features, ...shared].sort();
}


function AvailableComponentList({ available }: { available: string[] }) {
  return (
    <ul>
      {available.map((path) => (
        <li key={path}>
          <a href={`?component=${encodeURIComponent(path)}`}>{path}</a>
        </li>
      ))}
    </ul>
  );
}

function PreviewLauncher({ available }: { available: string[] }) {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>CMD UI Preview Harness</h2>
      <p>
        Pass <code>?component=&lt;path&gt;</code> (relative to{' '}
        <code>src/features/</code> for business screens, or{' '}
        <code>src/components/</code> for shared primitives, without the{' '}
        <code>.tsx</code> extension).
      </p>
      <p>Available components:</p>
      <AvailableComponentList available={available} />
    </div>
  );
}

function PreviewNotFound({ requested, available }: { requested: string; available: string[] }) {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Component not found: {requested}</h2>
      <p>Available components:</p>
      <AvailableComponentList available={available} />
    </div>
  );
}

function resolveExport(
  mod: Record<string, unknown>,
  baseName: string
): ComponentType<Record<string, never>> | null {
  if (typeof mod.default === 'function') {
    return mod.default as ComponentType<Record<string, never>>;
  }
  if (typeof mod[baseName] === 'function') {
    return mod[baseName] as ComponentType<Record<string, never>>;
  }
  const firstFunctionExport = Object.values(mod).find((value) => typeof value === 'function');
  return (firstFunctionExport as ComponentType<Record<string, never>>) ?? null;
}

function PreviewRoot() {
  const requested = useMemo(getRequestedComponentPath, []);
  const available = useMemo(listAvailableComponents, []);

  if (!requested) {
    return <PreviewLauncher available={available} />;
  }

  const featureKey = `./features/${requested}.tsx`;
  const sharedKey = `./components/${requested}.tsx`;
  const moduleKey = featureModules[featureKey] ? featureKey : sharedKey;
  const loader = modules[moduleKey];

  if (!loader) {
    return <PreviewNotFound requested={requested} available={available} />;
  }

  const baseName = requested.split('/').pop() ?? requested;
  const LazyComponent = lazy(async () => {
    const mod = (await loader()) as Record<string, unknown>;
    const Component = resolveExport(mod, baseName);
    if (!Component) {
      throw new Error(
        `No renderable export found in ${moduleKey}. Expected a default export or a named export called "${baseName}".`
      );
    }
    return { default: Component as ComponentType<Record<string, unknown>> };
  });

  return (
    <div className="app-container">
      <Suspense fallback={<div style={{ padding: 24 }}>Loading {requested}...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <PreviewRoot />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
