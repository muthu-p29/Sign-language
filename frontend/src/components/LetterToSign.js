import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const LetterToSign = () => {
    const [letter, setLetter] = useState('');
    const [imageData, setImageData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!letter || letter.length !== 1 || !/[a-zA-Z]/.test(letter)) {
            setError('Please enter a single letter (A-Z)');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/letter-sign/${letter}/`);
            const data = await response.json();
            if (data.success) {
                setImageData(data);
            } else {
                setError(data.error || 'Failed to fetch sign image');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card p-6 mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Letter to Sign Image
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
                Enter a single letter to see its American Sign Language (ASL) representation.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        maxLength="1"
                        value={letter}
                        onChange={(e) => setLetter(e.target.value.toUpperCase())}
                        placeholder="A-Z"
                        className="w-16 h-16 text-3xl text-center font-bold rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all h-16"
                    >
                        {isLoading ? 'Loading...' : 'Show Sign'}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-2"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </form>

            <AnimatePresence>
                {imageData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-8 flex flex-col items-center"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                                <img
                                    src={imageData.image_url}
                                    alt={`ASL Sign for ${imageData.letter}`}
                                    className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-lg"
                                    onLoad={() => setIsLoading(false)}
                                />
                                <div className="mt-4 text-center">
                                    <span className="text-4xl font-black text-blue-600 dark:text-blue-400">
                                        {imageData.letter}
                                    </span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {imageData.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LetterToSign;
