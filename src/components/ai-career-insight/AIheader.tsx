import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useContext } from "react";
import AiContext from "../_context/AiContextProvider";
import { Messages } from "@/types/types";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
// import AiContext from "../_context/AiContextProvider";

export default function AIheader({
  messages,
  setMessages,
}: {
  messages: Messages[];
  setMessages: Dispatch<SetStateAction<Messages[]>>;
}) {
  const { tabState, setTabState, uploadSucces, setUploadSucces } =
    useContext(AiContext);
  return (
    <div className=" py-[0.7rem] flex justify-center items-center flex-col relative w-full max-w-4xl mx-auto font-landpage ">
      {/* <div className=" w-full h-5 bg-gradient-to-b from-background to-transparent -bottom-3 z-[90] absolute"></div> */}

      <AiLogo
        setUploadSucces={setUploadSucces}
        uploadSucces={uploadSucces}
        openTab={setTabState}
        tabState={tabState}
        messages={messages}
        setMessages={setMessages}
      />
      <AnimatePresence initial={false}>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=" text-center "
          >
            <p className="text-2xl mb-4 ">
              Welcome to Arya!
            </p>

            <p className=" max-w-2xl text-zinc-400 p-2 ">
              Looking for your next role? Let me know how I can help you assess
              your next opportunities and sharpen your applications.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const AiLogo = ({
  messages,
  setMessages,
}: {
  uploadSucces: boolean;
  setUploadSucces: Dispatch<SetStateAction<boolean>>;
  openTab: Dispatch<SetStateAction<boolean>>;
  tabState: boolean;
  messages: Messages[];
  setMessages: Dispatch<SetStateAction<Messages[]>>;
}) => {
  const {
    tabState,
    setTabState,
    uploadSucces,
    setUploadSucces,
    setSessionId,
    chatRightBar,
    setChatRightBar, // <-- add this
  } = useContext(AiContext);
  const logoVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1] },
  };
  const clickAssistentext = () => {
    return (
      <div className=" absolute -bottom-0 left-1/2  text-sm  whitespace-nowrap  -translate-x-1/2 rounded-full border px-2  ">
        Start new chat
      </div>
    );
  };
  const handleClick = () => {
    setSessionId(null);
    setUploadSucces(false);
    setTabState(false);
    setMessages([]);
  };
  return (
    <div className=" relative w-full flex justify-center items-center">
      <> {messages.length > 0 && clickAssistentext()}</>

      <motion.button
        variants={logoVariants}
        initial="initial"
        animate={tabState && !uploadSucces ? "animate" : "initial"}
        transition={
          tabState && !uploadSucces
            ? {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
                repeatType: "loop",
              }
            : {}
        }
        onClick={handleClick}
        disabled={tabState && !uploadSucces}
        type="button"
        aria-label="AI Agent"
        className="rounded-full disabled:cursor-wait relative mb-[2rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:outline-offset-0 dark:focus-visible:outline-primaryDark"
      >
        <svg
          className="w-16"
          viewBox="0 0 838 837"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M515.718 110.605C621.291 149.011 714.28 313.637 646.577 499.743C578.874 685.848 438.407 805.582 332.834 767.176C227.261 728.77 172.327 427.631 240.03 241.525C264.94 173.052 302.98 129.691 346.376 104.145C420.926 60.2597 448.989 86.3295 515.718 110.605Z"
            fill="url(#linearGradient1)"
            fillOpacity="0.6"
          />
          <path
            d="M156.136 453.009C156.169 480.494 140.036 537.977 222.056 604.127C338.957 655.053 526.064 778.991 591.853 627.973C657.641 476.956 715.723 241.089 598.822 190.163C481.921 139.237 221.924 301.992 156.136 453.009Z"
            fill="url(#linearGradient2)"
            fillOpacity="0.6"
          />
          <path
            opacity="0.8"
            d="M766.324 448.634C743.549 558.643 594.059 674.407 400.133 634.258C206.208 594.109 67.4634 472.382 90.2388 362.373C113.014 252.364 403.08 154.565 597.005 194.714C668.356 209.486 716.75 240.874 748.289 280.13C802.469 347.57 780.72 379.1 766.324 448.634Z"
            fill="url(#linearGradient3)"
            fillOpacity="0.5"
          />
          <ellipse
            cx="419"
            cy="409"
            rx="419"
            ry="409"
            fill="url(#radialGradient1)"
          />
          <ellipse
            className="animate-pulse"
            cx="419"
            cy="409"
            rx="419"
            ry="409"
            fill="url(#radialGradient2)"
          />
          <ellipse
            cx="419"
            cy="409"
            rx="419"
            ry="409"
            fill="url(#radialGradient3)"
          />

          <defs>
            <linearGradient
              id="linearGradient1"
              x1="420.705"
              y1="249.747"
              x2="423.671"
              y2="663.385"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00D1FF" />
              <stop offset="1" stopColor="#C626FF" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="linearGradient2"
              x1="487.879"
              y1="-248.502"
              x2="487.879"
              y2="140.966"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00A3FF" stopOpacity="0.14" />
              <stop offset="1" stopColor="#FF00B8" />
            </linearGradient>

            <linearGradient
              id="linearGradient3"
              x1="161.766"
              y1="376.102"
              x2="594.449"
              y2="567.328"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00FFE0" />
              <stop offset="1" stopColor="#C626FF" stopOpacity="0" />
            </linearGradient>

            <radialGradient
              id="radialGradient1"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(419 409) rotate(90) scale(358.5 367.131)"
            >
              <stop stopColor="white" />
              <stop offset="0.193741" stopColor="#E4E4E4" />
              <stop offset="1" stopColor="#737373" stopOpacity="0" />
            </radialGradient>

            <radialGradient
              id="radialGradient2"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(419 409) rotate(90) scale(293.5 300.566)"
            >
              <stop stopColor="white" />
              <stop offset="0.314072" stopColor="white" />
              <stop offset="1" stopColor="#737373" stopOpacity="0" />
            </radialGradient>

            <radialGradient
              id="radialGradient3"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(419 409) rotate(90) scale(534 546.857)"
            >
              <stop stopColor="#545454" stopOpacity="0" />
              <stop offset="1" stopColor="#5D64FF" stopOpacity="0.35" />
            </radialGradient>
          </defs>
        </svg>
      </motion.button>
    </div>
  );
};
