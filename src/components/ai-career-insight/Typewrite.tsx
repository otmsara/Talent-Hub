// import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StramResponse from "./StramResponse";

// const LETTER_DELAY = 0.035;
// const BOX_FADE_DURATION = 0.125;

export const Typewrite = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const chunkSize = 5; // Number of characters to append per interval
    const interval = setInterval(() => {
      if (index < text.length) {
        // Append the next chunk of characters
        setDisplayedText((prev) => prev + text.slice(index, index + chunkSize));
        index += chunkSize;
      } else {
        clearInterval(interval);
      }
    }, 5); // Fast typing speed (5ms per chunk)
    return () => clearInterval(interval);
  }, [text]);
  return <StramResponse response={displayedText} />;
};
// <p className="my-4  font-medium ai_response   ">
//   <span className="ml-3">
//     {text.split("").map((l, i) => (
//       <motion.span
//         initial={{
//           opacity: 1,
//         }}
//         key={`${i}`}
//         className="relative"
//       >
//         <motion.span
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: 1,
//           }}
//           transition={{
//             delay: i * LETTER_DELAY,
//             duration: 0,
//           }}
//         >
//           {l}
//         </motion.span>
//         <motion.span
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: [0, 1, 0],
//           }}
//           transition={{
//             delay: i * LETTER_DELAY,
//             times: [0, 0.1, 1],
//             duration: BOX_FADE_DURATION,
//             ease: "easeInOut",
//           }}
//           className="absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-foreground rounded-full"
//         />
//       </motion.span>
//     ))}
//   </span>
// </p>
