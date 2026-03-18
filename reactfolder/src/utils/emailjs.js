import emailjs from "@emailjs/browser";

export const EMAILJS_SERVICE_ID = "service_97u9bj7";
export const EMAILJS_PUBLIC_KEY = "hYTEnnh516nSj-76R";
export const EMAILJS_ADMIN_TEMPLATE_ID = "template_dc4l4ga";
export const EMAILJS_USER_TEMPLATE_ID = "template_54vay7o";

export const sendAdminAndUserEmails = async (templateParams) => {
  const emailOptions = {
    publicKey: EMAILJS_PUBLIC_KEY,
  };

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_ADMIN_TEMPLATE_ID,
    templateParams,
    emailOptions
  );

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_USER_TEMPLATE_ID,
    templateParams,
    emailOptions
  );
};