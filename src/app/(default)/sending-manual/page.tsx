import SendingManualPage from "@components/shared/pages/sending-manual/SendingManualPage";

export const metadata = {
    title: "SNS - Gửi tin thủ công",
    description: "Gửi tin nhắn thủ công đến người dùng",
};

/**
 * Sending Manual Page
 * @path /sending-manual
 */
const SendingManual = () => {
  return <SendingManualPage />
}

export default SendingManual