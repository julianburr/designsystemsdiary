import { NextApiRequest, NextApiResponse } from "next";
import mailchimp, { Status } from "@mailchimp/mailchimp_marketing";

const { MAILCHIMP_API_KEY, MAILCHIMP_API_SERVER, MAILCHIMP_AUDIENCE_ID } =
  process.env;

// Connect to mailchimp API client
mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_API_SERVER,
});

type ResponseData = {
  status?: "success" | "error";
  message?: string;
};

/**
 * Subscribes given email adress to the mailchimp mailing list
 * Note that it will set the subscription status to `pending`, which will
 * trigger the double-opt-in confirmation email to be sent out
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Endpoint only supports POST
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Method not found." });
  }

  // Return server error if credentials are not set
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_API_SERVER || !MAILCHIMP_AUDIENCE_ID) {
    return res
      .status(500)
      .json({ status: "error", message: "Credentials not found." });
  }

  console.log({ req });
  const { email, source } = req.body;

  // Return error if email is not specified
  if (!email) {
    return res
      .status(400)
      .json({ status: "error", message: "The email field is required." });
  }

  try {
    // Check first if the member already exists in mailchimp, since they might
    // be already subscribed or exist but unsubscribed, the latter would lead
    // to an error using `addListMember`
    const member: any = await mailchimp.lists.getListMember(
      MAILCHIMP_AUDIENCE_ID,
      email
    );

    if (member && member.status === "subscribed") {
      // Return error if email is already subscribed
      return res.status(400).json({
        status: "error",
        message: `The email you've entered (${email}) is already subscribed to the mailing list.`,
      });
    }

    if (member) {
      // Update existing member, they could e.g. be unsubscribed
      await mailchimp.lists.updateListMember(
        MAILCHIMP_AUDIENCE_ID as string,
        email,
        {
          email_address: email,
          status: "pending" as Status.pending,
          merge_fields: {
            SOURCE: source || "unknown",
          },
        }
      );
    } else {
      // Otherwise add email as new member
      await mailchimp.lists.addListMember(MAILCHIMP_AUDIENCE_ID as string, {
        email_address: email,
        status: "pending" as Status.pending,
        merge_fields: {
          SOURCE: source || "unknown",
        },
      });
    }

    return res.status(201).json({
      status: "success",
      message: `${email} has been added to the mailing list.`,
    });
  } catch (e: any) {
    return res.status(500).json({
      status: "error",
      message: e.response ? e.response.body?.detail : e.message,
    });
  }
}
