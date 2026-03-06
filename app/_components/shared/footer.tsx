export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t-[3px] border-white py-6 mt-auto">
            <div className="px-5">
                <div className="flex flex-col items-center gap-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 border-[3px] border-white rounded-xl flex items-center justify-center text-white font-black shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]">
                            C
                        </div>
                        <h2 className="text-xl font-black text-white">COSTME</h2>
                    </div>
                    
                    {/* Copyright */}
                    <p className="text-xs text-slate-400 font-semibold text-center">
                        © 2026 COSTME. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}