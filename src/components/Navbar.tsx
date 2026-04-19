type Page = "home" | "tasks" | "calendar" | "chat" | "settings";

type NavbarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

const navItems: Page[] = ["home", "tasks", "calendar", "chat", "settings"];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl gap-2 px-4 py-4">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              currentPage === item
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}