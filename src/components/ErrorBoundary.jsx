import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="glass-card p-8 max-w-md space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-2xl font-black text-fifa-gold">Упс! Виникла помилка</h2>
            <p className="text-sm text-fifa-muted">
              Щось пішло не так під час відображення сторінки.
            </p>
            {this.state.error?.message && (
              <p className="text-xs text-red-400 bg-red-950/40 p-3 rounded-lg font-mono text-left overflow-x-auto">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 bg-gradient-to-r from-fifa-gold to-amber-500 text-fifa-navy font-bold rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              🔄 Перезавантажити сторінку
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
