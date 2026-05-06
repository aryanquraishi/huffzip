import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Expand } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Huffman Coding", "Greedy Algorithms", "Optimal Trees", "Lossless Data", "High Speed"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1200px]">
        <div className="flex gap-8 pt-0 pb-8 lg:pb-16 items-center justify-center flex-col w-full">
          <div className="flex gap-4 flex-col items-center w-full px-4">
            <h1 className="m-0 py-2 text-4xl md:text-5xl lg:text-7xl max-w-3xl mx-auto tracking-tighter text-center font-bold text-[#1c1c19] dark:text-white flex flex-col items-center w-full leading-tight">
              <span className="text-[#005f6a] dark:text-teal-400">Efficient File Compression with</span>
              <span className="relative flex w-full max-w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 text-[#1c1c19] dark:text-white h-[1.5em]">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute inset-x-0 mx-auto w-full text-center font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                          y: 0,
                          opacity: 1,
                        }
                        : {
                          y: titleNumber > index ? -150 : 150,
                          opacity: 0,
                        }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-[#3e494a] dark:text-gray-400 max-w-2xl text-center mx-auto mt-4">
              Experience seamless, lossless data compression powered by intuitive greedy algorithms.
              Reduce file sizes significantly using optimal prefix codes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto justify-center px-4">
            <Link to="/how-it-works" className="no-underline w-full sm:w-auto">
              <button className="btn-outline-c w-full sm:w-56">
                How it Works
              </button>
            </Link>
            <Link to="/compress" className="no-underline w-full sm:w-auto">
              <button className="btn-primary-c w-full sm:w-56 text-base">
                Start Compressing <MoveRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
