import { cn } from '@/lib/utils';
import { TodoHeader } from '@/components/shared/todo-header';
import { CreateTask } from '@/components/shared/create-task';
import { Bg } from '@/components/shared/bg';
import { TodoBody } from '@/components/shared/todo-body';

export default function Home() {
  return (
    <>
      <Bg />
      <div className={cn('w-full h-full flex justify-center items-center absolute')}>
        <div
          className={cn(
            'flex flex-col justify-center gap-4 sm:gap-6 2xl:gap-8',
            'w-[clamp(16rem,86vw,30rem)] sm:w-[clamp(18rem,76vw,46rem)] md:w-[clamp(18rem,76vw,40rem)] lg:w-160 2xl:w-[clamp(18rem,76vw,46rem)]',
          )}
        >
          <TodoHeader />
          <CreateTask />
          <TodoBody />
        </div>
      </div>
    </>
  );
}
