import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'ccusage Dashboard',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-100 min-h-screen">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">ccusage</h1>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium [&.active]:border-blue-500 [&.active]:text-gray-900 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/daily"
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium [&.active]:border-blue-500 [&.active]:text-gray-900 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    Daily
                  </Link>
                  <Link
                    to="/blocks"
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium [&.active]:border-blue-500 [&.active]:text-gray-900 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    Blocks
                  </Link>
                  <Link
                    to="/sessions"
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium [&.active]:border-blue-500 [&.active]:text-gray-900 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    Sessions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
