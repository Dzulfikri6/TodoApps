import RegisterForm from "@/components/regist-form"
import {Toaster} from "sonner"
import { CardTitle } from "@/components/ui/card"

const Register =()=>{
    return(
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <RegisterForm />
            <Toaster richColors />
        </div>
    )
}

export default Register