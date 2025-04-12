import {LogoutButton} from "@/components/Auth/LogoutButton";

export function Dashboard() {

    return (
        <div className=" flex justify-evenly items-center p-4">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <LogoutButton/>
        </div>
    )
}