import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useEventsContext from "../components/hooks/useEventsContext";
import styles from "../components/utils/styling/GlobalAnimations.module.css";

const BuildingMid = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 120"
    preserveAspectRatio="xMidYMid meet"
    className={className}
    fill="currentColor"
  >
    <g transform="translate(0,120) scale(0.1,-0.1)" stroke="none">
      <path d="M1490 600 l0 -600 945 0 945 0 0 600 0 600 -945 0 -945 0 0 -600z m1800 519 c3 -98 0 -1043 -3 -1045 -5 -6 -1709 -6 -1714 0 -6 6 -4 1036 2 1046 8 12 1715 11 1715 -1z" />
      <path d="M1807 952 c-15 -3 -17 -32 -17 -317 0 -260 2 -315 14 -325 22 -17 476 -16 505 2 21 13 21 18 21 321 0 259 -2 309 -14 313 -16 6 -481 11 -509 6z m213 -82 c1 -5 1 -117 1 -247 l1 -238 -72 0 -73 0 1 238 c0 130 1 242 1 247 1 6 31 10 71 10 40 0 70 -4 70 -10z m222 -225 c0 -129 1 -241 2 -247 1 -9 -22 -14 -74 -16 l-75 -3 1 248 c1 136 2 249 3 251 0 1 33 2 71 2 l70 0 2 -235z" />
      <path d="M2610 952 c-6 -2 -10 -118 -10 -322 0 -310 1 -319 20 -325 11 -4 121 -7 245 -7 165 0 229 3 240 12 13 11 15 60 15 321 0 218 -3 310 -11 315 -11 7 -479 12 -499 6z m214 -70 c3 -5 6 -118 7 -253 l1 -244 -76 -3 -76 -3 0 249 c0 137 3 252 7 255 9 10 131 9 137 -1z m224 -249 l2 -253 -75 0 -75 0 0 255 0 256 73 -3 72 -3 3 -252z" />
      <path d="M5600 600 l0 -600 945 0 945 0 1 143 c2 386 2 690 1 865 l-2 192 -945 0 -945 0 0 -600z m1800 525 c13 -4 15 -70 13 -526 -1 -287 -4 -523 -6 -525 -2 -3 -391 -4 -863 -5 l-859 0 -2 518 c-1 285 0 523 2 529 2 9 231 12 852 12 466 1 855 -1 863 -3z" />
      <path d="M5869 946 c-5 -6 -9 -136 -9 -317 0 -261 2 -308 15 -319 18 -15 483 -16 497 -2 9 9 13 630 5 639 -10 9 -498 8 -508 -1z m211 -315 c0 -138 -3 -251 -7 -253 -5 -2 -38 -2 -75 0 l-68 4 0 242 c0 134 3 246 7 249 3 4 37 7 75 7 l68 0 0 -249z m215 238 c4 -5 7 -117 7 -247 l0 -237 -69 -3 -68 -3 1 248 c1 136 2 249 3 251 3 8 121 0 126 -9z" />
      <path d="M6678 951 c-7 -2 -16 -9 -20 -15 -4 -6 -8 -144 -8 -307 0 -279 1 -297 19 -313 17 -16 45 -18 250 -18 127 0 239 3 251 7 20 6 20 13 20 326 0 248 -3 319 -12 320 -65 3 -491 3 -500 0z m212 -316 l0 -255 -75 0 -75 0 0 248 c0 137 3 252 7 255 3 4 37 7 75 7 l68 0 0 -255z m213 0 l-1 -250 -68 -3 -69 -3 2 253 c1 139 2 254 2 256 1 2 31 2 68 0 l67 -3 -1 -250z" />
      <path d="M3693 953 c-10 -4 -13 -63 -13 -250 l0 -246 -55 7 c-98 11 -95 20 -95 -239 l0 -225 960 0 960 0 0 225 c0 259 3 250 -95 239 l-55 -7 0 247 c0 135 -3 247 -7 247 -36 8 -562 4 -577 -3 -17 -9 -18 -24 -15 -246 l4 -235 -213 -1 -212 -1 0 243 c0 133 -3 243 -7 244 -19 3 -569 4 -580 1z m252 -278 l0 -210 -89 0 -90 0 0 208 c-1 115 1 211 4 213 2 3 43 3 90 2 l85 -3 0 -210z m249 0 l0 -210 -90 0 -89 0 -1 205 c-1 113 1 209 3 213 3 4 43 6 91 5 l86 -3 0 -210z m771 0 l0 -210 -84 -3 c-46 -2 -87 1 -90 7 -3 5 -5 102 -3 215 l3 207 87 -3 87 -3 0 -210z m250 0 l0 -210 -89 0 -89 0 1 208 c0 114 1 209 1 212 1 3 40 4 89 3 l87 -3 0 -210z m-758 -411 l-2 -117 -420 1 -420 0 0 108 c-1 60 1 112 3 117 2 4 192 7 422 7 l418 0 -1 -116z m908 -3 l0 -114 -415 0 -415 0 -5 109 c-3 60 -4 112 -2 117 2 4 191 6 420 5 l417 -3 0 -114z m7 -189 c10 -10 10 -15 -2 -22 -9 -6 -356 -10 -881 -10 -707 0 -869 2 -878 13 -6 8 -7 17 -1 23 5 5 359 9 879 9 698 0 873 -3 883 -13z" />
    </g>
  </svg>
);

const BuildingTop = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 162"
    preserveAspectRatio="xMidYMid meet"
    className={className}
    fill="currentColor"
  >
    <g transform="translate(0,162) scale(0.1,-0.1)" stroke="none">
      <path d="M1886 1583 c-3 -21 -6 -144 -6 -273 l1 -235 26 -19 c24 -17 38 -18 179 -12 l154 7 -2 -256 -3 -256 -1090 0 c-633 1 -1096 -3 -1104 -8 -12 -7 -14 -54 -12 -262 1 -139 5 -257 7 -261 3 -4 2005 -8 4448 -8 l4444 0 5 25 c2 14 5 128 6 254 2 201 0 230 -14 245 -15 15 -106 16 -1103 16 l-1086 -1 0 253 1 253 152 -4 c135 -3 154 -2 171 14 19 17 20 32 20 254 0 130 -3 253 -6 274 l-7 37 -2587 0 -2587 0 -7 -37z m5088 -243 l0 -175 -2487 -3 -2487 -2 0 180 0 180 2487 -2 2488 -3 -1 -175z m-352 -587 c0 -112 -1 -206 -1 -210 -1 -8 -4261 -7 -4268 0 -3 3 -6 341 -3 405 0 10 431 12 2137 10 l2136 -3 -1 -202z m2214 -496 l1 -177 -4345 -2 c-2887 -2 -4346 0 -4350 7 -4 6 -6 87 -4 180 l3 170 4347 0 4347 -1 1 -177z" />
    </g>
  </svg>
);

const Sun = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 181 182"
    preserveAspectRatio="xMidYMid meet"
    className={className}
    fill="currentColor"
  >
    <g transform="translate(0,182) scale(0.05,-0.05)" stroke="none">
      <path d="M1722 3552 c-41 -49 -20 -572 23 -600 85 -53 105 1 111 297 5 285 -5 331 -76 331 -19 0 -45 -12 -58 -28z" />
      <path d="M564 3056 c-47 -47 -22 -89 151 -261 184 -183 244 -211 286 -134 19 37 1 62 -163 230 -182 186 -226 213 -274 165z" />
      <path d="M2760 2898 c-99 -100 -180 -186 -180 -191 0 -139 111 -107 305 88 174 175 197 215 151 261 -49 49 -99 20 -276 -158z" />
      <path d="M1520 2722 c-949 -307 -912 -1581 54 -1832 714 -186 1379 517 1146 1210 -166 492 -718 778 -1200 622z m620 -194 c620 -291 623 -1151 6 -1431 -682 -310 -1399 382 -1086 1048 184 392 683 569 1080 383z" />
      <path d="M2973 1883 c-100 -110 -16 -148 285 -132 297 17 360 48 271 138 -50 49 -510 45 -556 -6z" />
      <path d="M64 1876 c-35 -35 -29 -111 11 -133 104 -59 605 7 605 79 0 75 -547 123 -616 54z" />
      <path d="M725 855 c-183 -184 -207 -225 -161 -271 46 -46 86 -23 261 151 173 172 203 229 151 281 -42 42 -63 28 -251 -161z" />
      <path d="M2613 1003 c-50 -55 -47 -60 152 -258 184 -183 225 -207 271 -161 47 47 22 89 -161 271 -199 198 -211 205 -262 148z" />
      <path d="M1739 648 c-64 -76 -18 -588 52 -588 73 0 89 57 89 310 0 288 -51 388 -141 278z" />
    </g>
  </svg>
);

const BuildingBottom = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 207"
    className={className}
    preserveAspectRatio="xMidYMid meet"
    fill="currentColor"
  >
    <g transform="translate(0,207) scale(0.1,-0.1)" stroke="none">
      <path d="M1100 1253 c0 -449 -3 -820 -7 -824 -4 -4 -34 -4 -67 0 -52 7 -61 6 -81 -13 -21 -20 -22 -26 -15 -146 3 -69 3 -131 -1 -139 -5 -11 -82 -13 -427 -12 -410 2 -421 1 -431 -18 -14 -25 -13 -32 3 -54 13 -16 228 -17 4419 -17 2423 0 4412 3 4421 6 10 4 16 18 16 40 0 27 -5 36 -22 42 -13 4 -201 5 -418 2 -256 -3 -399 -1 -406 5 -9 7 -10 47 -5 140 7 123 6 131 -13 152 -20 21 -26 22 -80 13 -32 -5 -63 -7 -67 -4 -5 3 -9 374 -9 825 l0 819 -3405 0 -3405 0 0 -817z m2056 734 c5 -5 5 -1549 0 -1554 -4 -5 -1948 -4 -1953 1 -3 3 -7 1524 -3 1556 0 6 1950 3 1956 -3z m2595 -773 c0 -427 -2 -778 -4 -781 -5 -5 -528 -6 -533 -1 -2 2 -4 247 -4 544 l-1 539 73 5 73 5 3 133 3 132 -845 0 c-825 0 -846 0 -856 -19 -14 -28 -13 -224 2 -239 7 -7 40 -12 78 -12 l65 0 -2 -541 c-1 -298 -4 -543 -6 -546 -6 -5 -538 -6 -543 0 -3 3 -7 1509 -4 1557 0 3 563 4 1250 3 l1251 -2 0 -777z m2067 0 c1 -460 -2 -780 -7 -783 -5 -3 -448 -4 -985 -1 l-976 5 0 775 c-1 426 0 777 0 780 0 3 442 4 982 3 l983 -2 3 -777z m-2540 444 l-3 -43 -767 -3 -768 -2 0 45 0 45 771 0 770 0 -3 -42z m-160 -685 l-3 -546 -93 -1 c-52 -1 -96 3 -99 8 -3 4 -6 211 -7 460 l-1 451 -410 0 -410 0 0 -457 c0 -251 -2 -458 -5 -460 -3 -3 -47 -2 -98 1 l-94 6 -1 543 -2 542 613 0 612 0 -2 -547z m-662 284 c7 -6 6 -818 0 -825 -7 -6 -256 -6 -262 1 -6 6 -6 815 0 825 4 8 254 7 262 -1z m362 -2 c10 -4 12 -88 10 -410 -1 -224 -6 -409 -11 -412 -4 -3 -65 -5 -135 -5 l-127 0 -3 408 c-1 225 -1 413 2 419 3 10 235 9 264 0z m3169 -919 c8 -8 10 -207 2 -212 -11 -6 -6949 -5 -6960 2 -12 7 -12 211 1 216 18 6 6951 0 6957 -6z" />
      <path d="M1476 1775 c-21 -10 -21 -18 -24 -364 -2 -253 1 -358 9 -367 9 -11 66 -14 288 -14 152 0 282 4 290 9 21 14 20 706 -2 728 -12 12 -58 15 -278 16 -163 1 -270 -2 -283 -8z m232 -359 c1 -165 -2 -283 -7 -290 -10 -12 -135 -15 -147 -3 -8 8 -9 551 -1 564 3 5 39 9 79 9 l73 -1 3 -279z m257 -11 l0 -289 -75 -1 c-41 0 -79 3 -85 6 -6 5 -9 111 -9 291 1 155 2 284 3 284 1 1 38 1 84 0 l82 -1 0 -290z" />
      <path d="M2381 1771 c-21 -13 -21 -21 -21 -371 l0 -358 23 -6 c29 -8 525 -8 555 0 l22 6 0 359 c0 355 0 358 -21 370 -34 17 -532 18 -558 0z m244 -361 l0 -285 -85 0 -85 0 -3 275 c-1 151 0 281 3 288 3 9 26 12 87 10 l83 -3 0 -285z m245 0 l0 -291 -81 3 -81 3 0 283 c1 155 1 284 1 287 1 3 37 5 81 5 l80 0 0 -290z" />
      <path d="M6070 1768 c-19 -16 -20 -25 -20 -367 0 -336 1 -351 19 -361 21 -11 537 -15 565 -4 14 5 16 47 16 364 0 294 -2 360 -14 369 -10 8 -95 12 -280 14 -234 2 -267 0 -286 -15z m240 -351 c3 -169 1 -282 -4 -288 -6 -5 -45 -9 -88 -9 l-78 0 0 290 0 291 83 -3 82 -3 5 -278z m248 -4 l-3 -288 -79 0 -79 0 1 283 c0 155 1 284 1 287 1 3 37 5 81 5 l80 0 -2 -287z" />
      <path d="M6973 1768 c-13 -15 -16 -65 -15 -369 0 -284 3 -353 14 -360 22 -14 562 -11 576 3 9 9 12 104 12 364 0 293 -2 354 -14 363 -11 9 -93 13 -286 14 -245 2 -273 0 -287 -15z m249 -345 c2 -153 1 -284 -1 -290 -4 -16 -157 -18 -166 -3 -8 13 -8 547 0 560 3 6 42 10 85 10 l79 0 3 -277z m241 -13 l0 -285 -77 -3 c-42 -2 -76 1 -76 5 -1 14 -1 558 0 566 0 4 34 7 76 5 l76 -3 1 -285z" />
      <path d="M4347 823 c-5 -8 -11 -88 -8 -110 1 -14 38 -17 65 -7 26 10 22 89 -6 108 -24 17 -44 20 -51 9z" />
    </g>
  </svg>
);

export default function Home() {
  const { floorIds, setFloorIds } = useEventsContext();

  const handleAddFloor = () => {
    setFloorIds((prev) => [...prev, uuidv4()]);
  };

  const handleRemoveFloor = () => {
    if (floorIds.length > 1) {
      setFloorIds((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex relative flex-col items-center justify-center w-full">
      <Sun
        className={`absolute top-[7%] right-[11%] w-[14em] h-[14em] fill-slate-300 ${styles.sunAnimation}`}
      />
      <div className="flex flex-col items-center justify-center mt-12 mb-10 gap-5 z-[10]">
        <h1 className="text-[4rem] italic text-sky-900">SENSOR PLANNER</h1>
        <p className="text-2xl text-slate-700 max-w-[42em] text-center leading-[2em]">
          Design, deploy, and evaluate sensor coverage across 2D floor plans.
          Optimize layouts, reduce overlap, and analyze spatial performance from
          sensor data.
        </p>
      </div>
      <p className="text-xl text-sky-900 max-w-[42em] mb-6 leading-[2em] z-[10]">
        <span className="font-semibold italic">Select a floor</span> on the
        building below to get started! Each floor acts like a{" "}
        <span className="font-semibold italic">save file</span> that you can
        save and load unique floor plans with custom sensor placements and
        interactions.
      </p>
      <div className="mb-4 flex gap-[23em] translate-y-[3.6em] z-[20]">
        <button
          onClick={handleAddFloor}
          className="text-sky-700 border-2 rounded-lg px-4 py-2 hover:text-sky-600 hover:scale-105 cursor-pointer -translate-x-1"
        >
          Add Floor
        </button>
        <button
          onClick={handleRemoveFloor}
          className="text-sky-700 border-2 rounded-lg px-4 py-2 hover:text-sky-600 hover:scale-105 cursor-pointer translate-x-4"
        >
          Delete Floor
        </button>
      </div>

      <div className="flex flex-col-reverse h-full max-w-[40em] mb-80 z-[10]">
        {/* Bottom Visual */}
        <div className="flex w-full justify-center">
          <BuildingBottom className=" w-[85%] h-auto fill-slate-500" />
        </div>

        {/* Middle Clickable Floors */}
        {floorIds.map((floorId, index) => (
          <Link
            key={floorId}
            to={`dashboard/floor/${index + 1}`}
            className="flex relative group w-full h-full rounded-md"
          >
            <div className="flex absolute group-hover:text-xl top-1/2 transform text-sky-700 font-semibold opacity-70">
              Floor {index + 1}
            </div>
            <BuildingMid className="flex w-[60em] h-auto mx-auto fill-slate-700 group-hover:fill-slate-400 group-hover:scale-105 transition-all z-[20]" />
          </Link>
        ))}

        {/* Top Visual */}
        <div className="flex w-full justify-center">
          <BuildingTop className=" w-[80%] translate-y-[0.15em] h-auto fill-slate-500 " />
        </div>
      </div>
    </div>
  );
}
