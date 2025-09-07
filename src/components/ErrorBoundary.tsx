import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { PixelCard, PixelButton } from './pixel'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-pixel-black p-4 flex items-center justify-center">
          <PixelCard className="p-6 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="font-pixel text-pixel-red text-xl mb-2">
              出错了！
            </h2>
            <p className="font-pixel text-pixel-white text-sm mb-4">
              页面遇到了一个错误。请刷新页面重试。
            </p>
            {this.state.error && (
              <div className="p-3 bg-pixel-dark-gray border-2 border-pixel-gray mb-4">
                <p className="font-pixel text-pixel-gray text-xs text-left">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <PixelButton variant="primary" onClick={this.handleReset}>
              刷新页面
            </PixelButton>
          </PixelCard>
        </div>
      )
    }

    return this.props.children
  }
}