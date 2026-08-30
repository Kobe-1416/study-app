import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f5f4ef] px-6 font-sans">
            <div className="w-full max-w-[460px] text-center">
                <p className="mb-2.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#3a5a6b]">
                    Study App
                </p>

                <h1 className="font-serif text-[32px] font-normal leading-tight text-[#242424]">
                    Learn a little every day.
                </h1>

                <div className="w-8 h-0.5 bg-[#3a5a6b] mx-auto my-[18px]" />

                <p className="mb-8 text-[15px] leading-relaxed text-[#6b6b6b]">
                    Track what you study, review what you forget, and keep a
                    record of your progress over time.
                </p>

                <div className="flex justify-center gap-3 flex-col sm:flex-row">
                    <Link
                        href="/login"
                        className="rounded-md border border-[#3a5a6b] bg-[#3a5a6b] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f4858] hover:border-[#2f4858] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3a5a6b] focus-visible:outline-offset-2"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-md border border-[#dcd8ce] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#3a5a6b] transition-colors hover:border-[#3a5a6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3a5a6b] focus-visible:outline-offset-2"
                    >
                        Create an account
                    </Link>
                </div>
            </div>
        </main>
    );
}