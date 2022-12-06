import FriendRequest from "./FriendRequest";
import { motion, AnimatePresence } from "framer-motion";

const RightSidebar = ({ suggestions, getProfileFeed }) => {
  return (
    <div className="p-1 h-[80vh] overflow-auto rounded-xl bg-secondary hidden md:block md:w-[24%] sticky top-3">
      <div className=" p-3">
        <div className="w-full flex flex-row justify-between">
          <p className="text-gray-100 font-bold text-sm">SUGGESTIONS</p>
          <span className="rounded-xl text-xs bg-primary text-black font-bold px-2 flex items-center justify-center w-[2rem]">
            {suggestions?.length}
          </span>
        </div>
        <div className="mt-3">
          <AnimatePresence>
            {suggestions?.map((profile, i) => {
              return (
                <motion.div 
                  key={i}
                  exit = {{
                    scale : 0.9,
                    opacity : 0
                  }}>
                  <FriendRequest {...profile} getProfileFeed={getProfileFeed} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
