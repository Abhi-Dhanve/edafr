import { useNavigate } from "react-router";

export default function () {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center gap-y-5 h-screen">
      <div className="text-center">
        <h1 className="font-bold text-2xl">404</h1>
        <h2 className="text-foreground/70">Not Found</h2>
      </div>

      <button
        onClick={() => navigate("/")}
        className="bg-primary text-primary-foreground py-1 px-8 rounded-lg"
      >
        Go Back
      </button>
    </div>
  );
}
