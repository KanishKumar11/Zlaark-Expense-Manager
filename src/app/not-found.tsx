import Logo from "@/components/Logo";

function Error({ statusCode }: { statusCode: number }) {
  return (
    <div className=" h-[80%] gap-10 flex items-center justify-center ">
      <div className="text-center space-y-4">
        <Logo />
        <h1 className="text-4xl font-bold text-rose-600 mb-2">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground">
          {statusCode === 404
            ? "The page you are looking for doesn't exist or has been moved."
            : "An unexpected error occurred. Please try again later."}
        </p>
        <a href="/" className="mt-4 text-emerald-500 underline">
          Go back to the homepage
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res: any; err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
