import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In an enterprise app, we would log this to Sentry or Datadog here
    console.error("Uncaught React Exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
          <AlertOctagon className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-center text-gray-500 max-w-md mb-6">
            A critical UI error occurred. Our engineering team has been notified. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
