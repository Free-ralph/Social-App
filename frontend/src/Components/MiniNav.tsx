import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

type MiniNavProps = {
  handlePageChange: (number: number) => void;
  currPageNo: number;
};

const MiniNav = ({ handlePageChange, currPageNo }: MiniNavProps) => {
  const navContent = [
    {
      title: "Feed",
      icon: <NewspaperOutlinedIcon />,
      badge: "",
    },
    {
      title: "People",
      icon: <PeopleOutlineIcon />,
      badge: "",
    },
    {
      title: "Profile",
      icon: <PersonOutlineOutlinedIcon />,
      badge: "",
    },
    {
      title: "About ME",
      icon: "ME",
      badge: "",
    },
  ];

  const inActiveNav =
    "p-4 text-gray-200 w-[25%] text-center hover:text-primary cursor-pointer";
  const activeNav =
    "p-4 text-primary w-[25%] text-center hover:text-primary cursor-pointer";
  return (
    <div className="col-span-3 flex h-[3.5rem] mb-2 w-[94%] m-auto px-1 bg-secondary rounded-xl justify-around lg:hidden sticky top-2 border border-opacity-50 border-primary z-50">
      {navContent.map((item, i) => (
        <div
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currPageNo ? activeNav : inActiveNav}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default MiniNav;
