import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"

export default function RemainingCard() {
    const monthNow = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date())
    return (
        <div className="flex justify-between space-x-3">
            <div className="border w-full border-gray-300 rounded-2xl p-4 flex justify-between items-center gap-2 mt-4 bg-green-100">
                <div className="border border-gray-100 rounded-xl p-2 bg-white">
                    <FaArrowTrendDown size={25} className="text-green-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm">Pemasukan {monthNow}</span>
                    <span className="text-lg font-bold">Rp. 0</span>
                </div>

            </div>
            <div className="border w-full border-gray-300 rounded-2xl p-4 flex justify-between items-center gap-2 mt-4 bg-red-100">
                <div className="border border-gray-100 rounded-xl p-2 bg-white">
                    <FaArrowTrendUp size={25} className="text-red-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm">Pengeluaran {monthNow}</span>
                    <span className="text-lg font-bold">Rp. 0</span>
                </div>

            </div>
        </div>

    )
}