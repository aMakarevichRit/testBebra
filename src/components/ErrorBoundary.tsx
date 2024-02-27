import { Component } from 'react';

// ErrorBoundary component to handle errors
class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({ hasError: true });
		// You can log the error to an error reporting service here
		console.error(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// You can render a fallback UI here
			return <h1>Something went wrong.</h1>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
