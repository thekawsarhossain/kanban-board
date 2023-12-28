const Skeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: Math.floor(Math.random() * (5 - 3 + 1)) + 3 }, (_, index) => (
                <div key={`skeleton__${index}`} className="bg-white p-3 min-h-24 rounded-lg shadow-sm border-2 duration-100 cursor-grab relative">
                    <p className="w-11/12 py-1.5 bg-gray-300 rounded animate-pulse"></p>
                    <p className="w-3/4 py-1.5 bg-gray-300 rounded mt-2.5 animate-pulse"></p>
                    <p className="w-10 py-1 absolute bottom-2 text-xs bg-gray-200 rounded animate-pulse"></p>
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
