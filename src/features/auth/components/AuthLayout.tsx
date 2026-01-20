export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden bg-background">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-8 z-10">
                <a
                    href="/"
                    className="flex items-center gap-3 self-center font-bold text-2xl mb-2 hover:scale-105 transition-transform"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-6"
                        >
                            <path d="M17 3H7"></path>
                            <path d="M20 21H4"></path>
                            <path d="M22 6.5C22 4.01472 19.9853 2 17.5 2C15.0147 2 13 4.01472 13 6.5C13 8.98528 15.0147 11 17.5 11C18.1726 11 18.8078 10.8524 19.3791 10.5849L22 13L21 21"></path>
                            <path d="M17.5 21L14.5 9"></path>
                        </svg>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Flowgent
                    </span>
                </a>
                {children}
            </div>
        </div>
    );
};