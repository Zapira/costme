import { BsArrowRight } from "react-icons/bs";
import { GiSparkles } from "react-icons/gi";

export default function Hero() {
    return (
        <section className="relative overflow-hidden py-12">
            <div className="absolute top-10 left-0 w-64 h-64 bg-violet-200 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-0 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            <div className="px-5 relative z-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-violet-100 border-[3px] border-slate-900 rounded-full mb-4 shadow-[4px_4px_0_0_rgb(139,92,246)]">
                        <GiSparkles size={14} className="text-violet-600" strokeWidth={3} />
                        <span className="text-xs font-bold text-violet-900">
                            Aplikasi #1 untuk Kelola Keuangan
                        </span>
                    </div>


                    <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
                        Kelola Uang Anda dengan{" "}
                        <span className="bg-linear-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent font-bold">
                            Lebih Mudah
                        </span>
                    </h1>

                    <p className="text-base text-slate-600 font-semibold mb-6 leading-relaxed">
                        MoneyManager membantu Anda mencatat setiap transaksi, melacak pengeluaran, dan merencanakan keuangan dengan cara yang simpel dan menyenangkan.
                    </p>

                    <div className="space-y-3 mb-6">
                        <button className="w-full px-6 py-4  bg-white border-[3px] border-slate-900 rounded-2xl text-base font-bold text-slate-900 shadow-[6px_6px_0_0_rgb(139,92,246)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0_0_rgb(139,92,246)] transition-all flex items-center justify-center gap-2">
                            Mulai Gratis
                            <BsArrowRight size={20} strokeWidth={3} />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}