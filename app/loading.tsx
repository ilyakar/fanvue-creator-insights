/* ------------------------------------------------------------
Provides a quiet loading state while a route fetches saved information.
---------------------------------------------------------------*/

// Provides a quiet loading state while a route fetches saved information.
const LoadingPage = () => (
  <div className="route-loading" role="status">
    <span className="loading-dot" />
    <span>Getting things ready…</span>
  </div>
)

export default LoadingPage
