import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-black fixed w-full z-50 top-0">
      <div className="mx-auto px-12">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-white tracking-wide">
            BULLS & COWS
          </Link>
          <div className="hidden md:block">
            <div className="flex items-center space-x-12">
              <Link href="/" className="nav-link">
                GAME
              </Link>
              <Link href="/about" className="nav-link">
                ABOUT
              </Link>
              <Link href="/leaderboard" className="nav-link">
                LEADERBOARD
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 