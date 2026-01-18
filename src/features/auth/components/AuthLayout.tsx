export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-full max-w-sm flex flex-col gap-6">
                <a
                    href="/"
                    className="flex items-center gap-2 self-center font-bold text-xl mb-4"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-5"
                        >
                            <path d="M17 3H7"></path>
                            <path d="M20 21H4"></path>
                            <path d="M22 6.5C22 4.01472 19.9853 2 17.5 2C15.0147 2 13 4.01472 13 6.5C13 8.98528 15.0147 11 17.5 11C18.1726 11 18.8078 10.8524 19.3791 10.5849L22 13L21 21"></path>
                            <path d="M17.5 21L14.5 9"></path>
                        </svg>
                    </div>
                    Flowgent
                </a>
                {children}
            </div>
        </div>
    );
};