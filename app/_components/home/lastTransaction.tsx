import Link from "next/link";

export default function LastTransaction() {
    const data = [
        {
            name: "Gaji Bulanan",
            type: "salary",
            amount: 8000000,
            date: "25 Jan",
            typeCost: "income"
        },
        {
            name: "Belanja Bulanan",
            type: "shopping",
            amount: 8000000,
            date: "25 Jan",
            typeCost: "expense"
        }
    ]

    let formatRupiah = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits:0
    })

    const formattedData = data.map(item => ({
        ...item,
        amount: formatRupiah.format(item.amount)
    }))



    return (
        <div className="mt-9">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
                <Link href="/transactions" className="text-sm font-bold text-purple-700">Lihat Semua</Link>
            </div>
            {formattedData.slice(0, 5).map((item: any, key: any) => {
                return (
                    <div key={key}>
                        <div className="mt-4">
                            <div className="border border-gray-300 rounded-2xl p-4 flex items-center space-x-4">
                                <div className={`rounded-xl  p-3 ${item.typeCost === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <span className="text-2xl">{item.typeCost === 'income' ? '📈' : '💸'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-bold">{item.name}</h2>
                                    <span className="text-[12px] opacity-40 font-bold">{item.type} {item.date}</span>
                                </div>
                                <div className="flex flex-col ml-auto">
                                    <h2 className={`text-lg font-bold ${item.typeCost === 'income' ? 'text-green-600' : 'text-red-600'}`}>{item.typeCost === 'income' ? `+${item.amount}` : `- ${item.amount}`}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            })}


        </div>
    );
}