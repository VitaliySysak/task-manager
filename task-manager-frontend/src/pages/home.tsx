import { TodoBlock } from '../components/shared/todo-block';

export default function Home() {
  return (
    <>
      <img
        className="w-full hidden sm:hidden md:hidden lg:block"
        src="/images/bg-desktop-dark.webp"
        fetchPriority="high"
        alt="hero"
      />
      <img
        className="w-full sm:block md:block lg:hidden"
        src="/images/bg-mobile-dark.webp"
        fetchPriority="high"
        alt="hero"
      />
      <TodoBlock />
    </>
  );
}
