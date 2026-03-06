import GoogleFormUi from "@/app/_components/auth/register/googleFormUi";
// import Footer from "@/app/_components/shared/footer";
import SecondNavbar from "@/app/_components/shared/secondNavbar";

export default function Register() {

    return (
        <div className="bg-gray-50 shadow-md max-w-lg mx-auto min-h-screen flex flex-col ">
            <div className="bg-white">
                <SecondNavbar />
            </div>
            <div className="inset-0 flex items-center justify-center pr-6 pl-4">

                <GoogleFormUi />
            </div>
            {/* <Footer /> */}
        </div>
    );
}
