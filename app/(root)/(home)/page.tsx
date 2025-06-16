import MeetingTypeList from "@/components/MeetingTypeList";

const Home = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [hourMinute, period] = time.split(" ");

  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    now
  );
  return (
    <section className="size-full gap-8 flex flex-col text-white">
      <div className="bg-hero w-full bg-cover h-[300px] max-sm:py-4 max-sm:px-6 sm:py-6 sm:px-8  md:py-8 md:px-10 rounded-[20px]">
        <div className="flex justify-center items-start flex-col h-full">
          <div>
            <div className="flex items-baseline gap-x-2 mb-2">
              <p className="max-sm:text-5xl sm:text-7xl font-bold">
                {hourMinute}
              </p>
              <p className="max-sm:text-xl sm:text-2xl">{period}</p>
            </div>
            <p className="max-sm:text-xl sm:text-2xl leading-[30px] text-sky">
              {date}
            </p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Home;
