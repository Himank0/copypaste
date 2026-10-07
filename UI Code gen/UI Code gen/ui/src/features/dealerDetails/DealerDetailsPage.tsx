import { useParams, Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routes/paths';

/**
 * Placeholder stub for the dealer details page (out of scope per the Home
 * spec — "dealer detail page is not built yet"). Registered as a real route
 * so HomePage's Open action can navigate via useNavigate()/<Link> instead of
 * an ad hoc callback prop (Constitution §13).
 */
export function DealerDetailsPage() {
  const { dealerId } = useParams<{ dealerId: string }>();

  return (
    <div style={{ padding: 48 }}>
      <h1>Dealer Details</h1>
      <p>Dealer ID: {dealerId}</p>
      <p>This page is not built yet.</p>
      <Link to={ROUTE_PATHS.home}>Back to Home</Link>
    </div>
  );
}

export default DealerDetailsPage;
