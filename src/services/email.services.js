import { newOtp } from "./otp.services"
import { getTemplate } from "./template.services";


const sendEmailToken = async ({email = null}) => {
    try {
        // 1. get opt token
        const token = await newOtp({ email });
        // 2. get template html
        const templateEmail = await getTemplate({
            temp_name: 'HTML EMAIL TOKEN'
        })

        // 3. send email

    } catch (error) {
        
    }
}