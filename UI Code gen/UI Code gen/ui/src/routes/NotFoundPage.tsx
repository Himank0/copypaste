import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../routes/paths';

/** Controlled not-found view for unknown routes (Constitution §13). */
export function NotFoundPage() {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to={ROUTE_PATHS.home}>Return home</Link>
    </div>
  );
}

export default NotFoundPage;
