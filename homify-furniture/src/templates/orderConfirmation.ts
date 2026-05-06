type VerificationEmailProps = {
  name: string;
  orderId: string;
  verificationUrl: string;
};

type UnderReviewEmailProps = {
  name: string;
  orderId: string;
  trackingUrl: string;
};

type VerifiedOrderOwnerNotificationProps = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  category?: string | null;
  dashboardUrl?: string;
};

export const customOrderVerificationTemplate = ({
  name,
  orderId,
  verificationUrl,
}: VerificationEmailProps) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Verify your email to complete your request</h2>
      
      <p>Hi ${name},</p>
      
      <p>
        Thank you for your custom order request. Please confirm your email address so we can move your request into review.
      </p>

      <p>
        <strong>Order ID:</strong> ${orderId}
      </p>

      <p>
        Click the button below to verify your email address and activate your request.
      </p>

      <p style="margin: 20px 0;">
        <a 
          href="${verificationUrl}" 
          style="
            background-color: #4CAF50;
            color: white;
            padding: 10px 16px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
          "
        >
          Verify My Email
        </a>
      </p>

      <p style="font-size: 12px; color: #777;">
        If the button doesn’t work, copy and paste this link into your browser:<br/>
        ${verificationUrl}
      </p>

      <p>
        This verification link expires in 24 hours. If you did not submit this request, you can safely ignore this email.
      </p>

      <p>
        <strong>0719 352 072</strong>
      </p>

      <br/>

      <p>
        We appreciate your trust in us and will keep you updated.
      </p>

      <p>
        Best regards,<br/>
        The Team
      </p>

    </div>
  `;
};

export const customOrderUnderReviewTemplate = ({
  name,
  orderId,
  trackingUrl,
}: UnderReviewEmailProps) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Your request is now under review</h2>

      <p>Hi ${name},</p>

      <p>
        Your email has been verified successfully. Your custom order request is now under review by our team.
      </p>

      <p>
        <strong>Order ID:</strong> ${orderId}
      </p>

      <p>
        You can track your order status anytime using this secure link:
      </p>

      <p style="margin: 20px 0;">
        <a
          href="${trackingUrl}"
          style="
            background-color: #111827;
            color: white;
            padding: 10px 16px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
          "
        >
          Track Your Order
        </a>
      </p>

      <p style="font-size: 12px; color: #777;">
        If the button does not work, copy and paste this link into your browser:<br/>
        ${trackingUrl}
      </p>

      <p>
        We will review your request and follow up with the next steps as soon as possible.
      </p>

      <p>
        If you have any questions, feel free to reach us at <strong>0719 352 072</strong>.
      </p>

      <p>
        Best regards,<br/>
        The Team
      </p>
    </div>
  `;
};

export const verifiedOrderOwnerNotificationTemplate = ({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  category,
  dashboardUrl,
}: VerifiedOrderOwnerNotificationProps) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">A new verified custom order is ready for review</h2>

      <p>A customer has verified their email and the custom order is now ready for follow-up.</p>

      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Customer Email:</strong> ${customerEmail}</p>
      <p><strong>Customer Phone:</strong> ${customerPhone || "Not provided"}</p>
      <p><strong>Category:</strong> ${category || "Not provided"}</p>

      ${
        dashboardUrl
          ? `<p style="margin: 16px 0;"><a href="${dashboardUrl}" style="background-color: #111827; color: #fff; padding: 10px 14px; text-decoration: none; border-radius: 6px; display: inline-block;">Open Orders Dashboard</a></p>`
          : ""
      }

      <p>Please review the request and contact the customer with the next steps.</p>
    </div>
  `;
};
