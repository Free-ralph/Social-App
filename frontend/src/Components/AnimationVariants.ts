export const FadeVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export const SlideVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  slide: {
    opacity: 0,
    x: 20,
    transition : {
      duration : 0.2, 
      delay : 0
    }
  },
};

export const DrawerVariant = {
  hidden : {
    x : "-100%",
    transition : {
      ease : "easeOut"
    }
  }, 
  
  visible : {
    x : 0,
    transition : {
      ease : "easeInOut"
    }
  }
}
