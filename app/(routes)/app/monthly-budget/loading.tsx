export default function Loading() {
    return (
        <div className="bg-gray-50 p-6 max-w-lg mx-auto min-h-screen animate-pulse">

            <div className="h-16 bg-gray-300 rounded-xl mb-6"></div>

            <div className="h-[200px] bg-gray-300 rounded-2xl mb-6"></div>

            <div className="h-[120px] bg-gray-300 rounded-2xl mb-6"></div>

            <div className="space-y-3">
                <div className="h-16 bg-gray-300 rounded-xl"></div>
                <div className="h-16 bg-gray-300 rounded-xl"></div>
                <div className="h-16 bg-gray-300 rounded-xl"></div>
            </div>

        </div>
    );
}