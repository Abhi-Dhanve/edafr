
const Header = ({ title }: { title: string }) => {
  return (
    <header className="fixed w-full top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-white/10 py-4 px-4 lg:px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-zinc-100">{title}</h1>
        
        <div className="flex items-center space-x-4">
       
        
        </div>
      </div>
    </header>
  );
};

export default Header;