import React from "react";
import { styles } from "../styles";
import { Link } from "react-router-dom";
import { navLinks } from "../constants";
import { menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = React.useState("");
  const [toggle, setToggle] = React.useState(false);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-3.5 fixed top-0 z-20 bg-primary`}
    >
      <div className="w-full flex justify-between items-center maz-w-7xl mx-auto">
        <Link
          to="/"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
          className="text-white text-2xl font-bold "
        >
          <p className="text-[2vh] cursor-pointer font-semibold">
            Sithija Ruwan
          </p>
          <p className="text-[2vh] cursor-pointer font-semibold">
            Software Engineer | Designer
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${
                active === link.title ? "text-cyan-500" : "text-secondary"
              } hover:text-cyan-500 cursor-pointer`}
              onClick={() => {
                setActive(link.title);
              }}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[3.5vh] h-[3.5vh] object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === link.title ? "text-cyan-500" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(link.title);
                  }}
                >
                  <a href={`#${link.id}`}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
