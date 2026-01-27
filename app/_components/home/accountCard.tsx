export default function AccountCard() {
    return (
        <div className="mt-16 flex justify-center">
            <div className="relative w-full h-[250px] rounded-2xl bg-linear-to-br from-[#211515] via-[#002292] to-[#000a66] p-5 text-white shadow-xl">
                <div>
                    <p className="text-xs opacity-80">Saldo</p>
                    <h2 className="text-2xl font-bold tracking-wide">
                        Rp 0
                    </h2>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center text-xs opacity-90">
                    <span>CostMe</span>
                    <span>•••• 2451</span>
                </div>
            </div>
        </div>
    );
}
