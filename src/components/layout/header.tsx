import logo from "../../assets/images/logo.svg";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-6 px-4 py-5">
      <img src={logo} alt="Foreign Exchange Checker" className="block h-6.5" />
      <p className="m-0 text-[10px] sm:text-sm leading-tight tracking-widest text-neutral-200 whitespace-nowrap max-[820px]:whitespace-normal">
        55 CURRENCIES · EOD · ECB DATA
      </p>
    </header>
  );
}
