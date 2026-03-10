'use client';

import { FaGear } from "react-icons/fa6";

export default function Content() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6  px-5">
            {/* Animated Gear */}
            <div className="relative">
                <div className="absolute inset-0 bg-violet-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 border-[4px] border-slate-900 rounded-3xl flex items-center justify-center shadow-[8px_8px_0_0_rgb(15,23,42)]">
                    <FaGear size={50} className="text-white animate-spin-slow" />
                </div>
            </div>

            {/* Text Content */}
            <div className="text-center max-w-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                    Work in Progress 🚧
                </h2>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                    Fitur ini sedang dalam pengembangan dan akan segera hadir untuk kamu!
                </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex gap-2 mt-4">
                <div className="w-3 h-3 bg-violet-500 border-[2px] border-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-violet-500 border-[2px] border-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-violet-500 border-[2px] border-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>
        </div>
    );
}