import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const awaitingText = [
  "ARYA is thoughtfully reasoning to craft the optimal response...",
  // "Calculating... ARYA is now processing your request at full capacity. Please hold tight!",
  // "Initiating deep analysis. ARYA is carefully reasoning and determining the optimal response... Stay tuned!",
];
// "Your request is now in motion. Synthesizing data with precision...",

export const AItext = () => {
  return (
    <div className="flex   ">
      <BlockInTextCard examples={awaitingText} />
    </div>
  );
};

const BlockInTextCard = ({ examples }: { examples: string[] }) => {
  return (
    <div className="">
      <div>
        <Typewrite examples={examples} />
      </div>
    </div>
  );
};

const LETTER_DELAY = 0.035;
const BOX_FADE_DURATION = 0.125;

const FADE_DELAY = 5;
const MAIN_FADE_DURATION = 0.35;

const SWAP_DELAY_IN_MS = 5500;

const Typewrite = ({ examples }: { examples: string[] }) => {
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setExampleIndex((pv) => {
        // If the index is at the last item, stop the interval
        if (pv === examples.length - 1) {
          clearInterval(intervalId);
          return pv; // Keep the index at the last item
        }
        return pv + 1; // Increment index
      });
    }, SWAP_DELAY_IN_MS);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [examples.length]);

  return (
    <p className="font-medium   ">
      <span className="">
        {examples[exampleIndex].split("").map((l, i) => (
          <motion.span
            initial={{
              opacity: 1,
            }}
            animate={{
              opacity: 0,
            }}
            transition={{
              delay: FADE_DELAY,
              duration: MAIN_FADE_DURATION,
              ease: "easeInOut",
            }}
            key={`${exampleIndex}-${i}`}
            className="relative"
          >
            <motion.span
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: i * LETTER_DELAY,
                duration: 0,
              }}
            >
              {l}
            </motion.span>
            <motion.span
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                delay: i * LETTER_DELAY,
                times: [0, 0.1, 1],
                duration: BOX_FADE_DURATION,
                ease: "easeInOut",
              }}
              className="absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-foreground rounded-full"
            />
          </motion.span>
        ))}
      </span>
    </p>
  );
};
