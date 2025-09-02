import { motion } from "framer-motion";

export const LoadingAiText = ({ text }: { text: string }) => {
  return (
    <div className="">
      <BlockInTextCard examples={text} />
    </div>
  );
};

const BlockInTextCard = ({ examples }: { examples: string }) => {
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

const MAIN_FADE_DURATION = 3.5;

const Typewrite = ({ examples }: { examples: string }) => {
  return (
    <p className="font-medium">
      <span className="">
        {examples.split("").map((l, i) => (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: [0, 1, 0] }} // Alternate opacity
            transition={{
              duration: MAIN_FADE_DURATION,
              // Full cycle duration (0 → 1 → 0)
              repeat: Infinity, // Loop the animation
              ease: "easeInOut", // Smooth transition
            }}
            key={`${i}`}
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
        {/* <Icon
          icon="line-md:loading-alt-loop"
          className="h-5 w-5 text-muted-foreground"
        /> */}
      </span>
    </p>
  );
};
