'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="mb-8">
      <ul className="flex space-x-4 items-center">
        {isAuthenticated ? (
          <>
            <li>
              <Link
                href="/"
                className={`px-4 py-2 rounded-md ${
                  pathname === '/'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/kling-test"
                className={`px-4 py-2 rounded-md ${
                  pathname === '/kling-test'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Kling AI
              </Link>
            </li>
            <li>
              <Link
                href="/minimaxi"
                className={`px-4 py-2 rounded-md ${
                  pathname === '/minimaxi'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                MiniMaxi
              </Link>
            </li>
            <li className="ml-auto">
              <button
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              href="/login"
              className={`px-4 py-2 rounded-md ${
                pathname === '/login'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
} 