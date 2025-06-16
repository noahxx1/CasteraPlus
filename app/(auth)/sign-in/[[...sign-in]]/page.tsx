import { SignIn } from "@clerk/nextjs";

const SiginInPage = () => {
  return (
    <main className="h-screen w-full flex-center">
      <SignIn />
    </main>
  );
};

export default SiginInPage;
