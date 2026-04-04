import { useSession } from "@/lib/auth-client";
import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { data: session, isPending, error } = useSession();

	if (isPending) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-7 h-7 border-[3px] border-primary/10 border-t-primary border-b-primary rounded-full animate-spin" />
			</div>
		);
	}

	if (!session) {
		return <Navigate to="/sign-in" replace />;
	}

	console.log("✅ Session found:", session);
	return <>{children}</>;
};

export default ProtectedRoute;