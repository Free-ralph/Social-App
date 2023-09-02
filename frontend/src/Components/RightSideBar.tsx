import FriendRequest from "./FriendRequest";
import { motion, AnimatePresence } from "framer-motion";
import { SuggestionsType } from "../types/api";

type RightSideBarProps = {
  suggestions: SuggestionsType[] | undefined;
};
const RightSidebar = ({ suggestions }: RightSideBarProps) => {
  return (
    <div className="p-1 lg:h-[80vh] lg:overflow-auto rounded-xl bg-secondary lg:block w-[95%] m-auto lg:m-0 lg:w-[24%] lg:sticky lg:top-3">
      <div className=" p-3">
        <div className="w-full flex flex-row justify-between">
          <p className="text-gray-100 font-bold text-sm">SUGGESTIONS</p>
          <span className="rounded-xl text-xs bg-primary text-black font-bold px-2 flex items-center justify-center w-[2rem]">
            {suggestions ? suggestions.length : 0}
          </span>
        </div>
        {suggestions && (
          <>
            <div className="mt-3">
              <AnimatePresence>
                {suggestions?.length > 0 ? (
                  suggestions?.map((profile, i) => {
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{
                          scale: 0.9,
                          opacity: 0,
                        }}
                      >
                        <FriendRequest {...profile} />
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-200 mt-10 md:mt-5">
                    No suggestions to display
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
