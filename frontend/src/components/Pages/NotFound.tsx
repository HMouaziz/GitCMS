import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Link} from "@tanstack/react-router";

export const NotFound = () => {
    return (
        <div
            className=
                "flex min-h-[calc(100vh-4rem)] items-center justify-center p-4"
        >
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold">404</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Page Not Found
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">The page you&apos;re looking for can&apos;t be found.</p>
                    <Button asChild>
                        <Link to={"/dashboard"}>Return Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}